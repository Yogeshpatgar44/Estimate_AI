const Estimate = require('../models/Estimate');

const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateEstimate = async (req, res) => {
  const { title, clientName, clientEmail, input } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' }); // ✅ correct model

    const prompt = `
You are a construction estimator AI. Given this project description, return a JSON object with the following structure:

{
  "materials": [{ "item": "Bricks", "quantity": 500, "unitCost": 6 }],
  "labor": [{ "role": "Mason", "days": 5, "dailyRate": 800 }],
  "notes": "Any important notes"
}

Description: ${input}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Remove markdown and parse
    const jsonText = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(jsonText);

    const totalCost =
      parsed.materials.reduce((sum, m) => sum + m.quantity * m.unitCost, 0) +
      parsed.labor.reduce((sum, l) => sum + l.days * l.dailyRate, 0);

    res.json({
      title,
      clientName,
      clientEmail,
      ...parsed,
      totalCost,
    });
  } catch (err) {
    console.error('Gemini AI Error:', err);
  
    // Fallback mock estimate
    const mockEstimate = {
      materials: [
        { item: "Bricks", quantity: 500, unitCost: 6 },
        { item: "Cement Bags", quantity: 20, unitCost: 350 }
      ],
      labor: [
        { role: "Labor", days: 10, dailyRate: 800 }
      ],
      notes: "This is a mock AI-generated estimate.",
    };
  
    const totalCost =
      mockEstimate.materials.reduce((sum, m) => sum + m.quantity * m.unitCost, 0) +
      mockEstimate.labor.reduce((sum, l) => sum + l.days * l.dailyRate, 0);
  
    return res.status(200).json({
      title: req.body.title,
      clientName: req.body.clientName,
      clientEmail: req.body.clientEmail,
      ...mockEstimate,
      totalCost,
    });
  }
}
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

// PATCH /api/estimates/:id
exports.updateEstimate = async (req, res) => {
  try {
    const { id } = req.params;
    const { items } = req.body;

    // Split items back into materials and labor
    const materials = items.filter(item => item.type === 'Material');
    const labor = items.filter(item => item.type === 'Labor');

    // Recalculate totalCost
    const totalMaterialCost = materials.reduce((sum, m) => sum + m.quantity * m.rate, 0);
    const totalLaborCost = labor.reduce((sum, l) => sum + l.quantity * l.rate, 0);
    const totalCost = totalMaterialCost + totalLaborCost;

    const updated = await Estimate.findByIdAndUpdate(
      id,
      { materials, labor, totalCost },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Estimate not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Update Error:', err.message);
    res.status(500).json({ error: 'Failed to update estimate' });
  }
};