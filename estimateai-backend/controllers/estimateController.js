const Estimate = require('../models/Estimate');
const { sendEstimateEmail } = require('./emailService');

const axios = require('axios');

exports.generateEstimate = async (req, res) => {
  const { title, clientName, clientEmail, input } = req.body;

  try {
    const prompt = `
You are a professional construction cost estimation AI.

Given the following construction project description, return only a JSON response (no explanation). The JSON must contain:

{
  "materials": [ { "item": "...", "quantity": ..., "unitCost": ... } ],
  "labor": [ { "item": "...", "quantity": ..., "unitCost": ... } ],
  "equipment": [ { "item": "...", "quantity": ..., "unitCost": ... } ],
  "notes": "... (any special notes about the job site, working conditions, etc.)"
}

Rules:
- Use only data relevant to the specific project description.
- Do not return example items like 'Bricks', 'Cement Bags', or 'Labor' unless the input clearly requires them.
- Use accurate, realistic values for quantities and costs.
- Your response must be in **pure JSON format only**, without markdown or text.

Project Description:
${input}
`;


    const openRouterResponse = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const aiMessage = openRouterResponse.data.choices[0].message.content;

    // Clean and parse JSON
    const jsonText = aiMessage.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(jsonText);

    const subtotal =
      parsed.materials.reduce((sum, m) => sum + m.quantity * m.unitCost, 0) +
      parsed.labor.reduce((sum, l) => sum + l.quantity * l.unitCost, 0) +
      parsed.equipment.reduce((sum, e) => sum + e.quantity * e.unitCost, 0);

    const tax = subtotal * 0.1;
    const totalCost = subtotal + tax;

    return res.status(200).json({
      title,
      clientName,
      clientEmail,
      input,
      materials: parsed.materials,
      labor: parsed.labor,
      equipment: parsed.equipment,
      notes: parsed.notes || '',
      subtotal,
      tax,
      totalCost,
    });
  } catch (err) {
    console.error('OpenRouter AI Error:', err?.response?.data || err.message);
    return res.status(500).json({ error: 'AI failed to generate estimate. Try again later.' });
  }
};




exports.saveEstimate = async (req, res) => {
  try {
    const estimate = await Estimate.create({ user: req.user.id, ...req.body });
    res.status(201).json(estimate);
  } catch (err) {
    res.status(500).json({ message: 'Error saving estimate' });
  }
};


exports.getEstimates = async (req, res) => {
  try {
    const estimates = await Estimate.find({ user: req.user.id });
    res.json(estimates);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching estimates' });
  }
};

// In estimateController.js
exports.updateEstimate = async (req, res) => {
  try {
    const { id } = req.params;
    const { items, notes, title, clientName, clientEmail } = req.body;

    const materials = items.filter(i => i.type === 'Materials');
    const labor = items.filter(i => i.type === 'Labor');
    const equipment = items.filter(i => i.type === 'Equipment');

    const subtotal =
      materials.reduce((sum, m) => sum + m.quantity * m.unitCost, 0) +
      labor.reduce((sum, l) => sum + l.quantity * l.unitCost, 0) +
      equipment.reduce((sum, e) => sum + e.quantity * e.unitCost, 0);

    const tax = subtotal * 0.1;
    const totalCost = subtotal + tax;

    const updated = await Estimate.findByIdAndUpdate(
      id,
      { materials, labor, equipment, notes, title, clientName, clientEmail, subtotal, tax, totalCost },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Estimate not found' });

    res.json(updated);
  } catch (err) {
    console.error('Update Error:', err.message);
    res.status(500).json({ error: 'Failed to update estimate' });
  }
};



exports.getEstimateById = async (req, res) => {
  try {
    const estimate = await Estimate.findById(req.params.id);
    if (!estimate) return res.status(404).json({ error: 'Estimate not found' });
    res.json(estimate);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteEstimate = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Estimate.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Estimate not found' });
    }
    res.status(200).json({ message: 'Estimate deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.sendEstimateEmailController = async (req, res) => {
  try {
    const { toEmail, subject, html, attachment } = req.body;

    if (!toEmail || !subject || !html || !attachment?.content) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    await sendEstimateEmail(
      toEmail,
      subject,
      html,
      attachment.content // base64 string only
    );

    res.status(200).json({ message: 'Email sent successfully with PDF' });
  } catch (err) {
    console.error('Send email error:', err);
    res.status(500).json({ error: 'Failed to send email with PDF' });
  }
};
