const Estimate = require('../models/Estimate');

const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateEstimate = async (req, res) => {
  const { title, clientName, clientEmail, input } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `
      You are a construction estimator AI. Given this project description, return a JSON object with the following structure:

      {
        "materials": [{ "item": "Bricks", "quantity": 500, "unitCost": 6 }],
        "equipment": [{ "item": "Excavator", "quantity": 2, "unitCost": 5000 }],
        "notes": "Any important notes"
      }

      Description: ${input}
      `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonText = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(jsonText);

    const subtotal =
      parsed.materials.reduce((sum, m) => sum + m.quantity * m.unitCost, 0) +
      parsed.labor.reduce((sum, l) => sum + l.days * l.dailyRate, 0) +
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
    console.error('Gemini AI Error:', err);

    const fallbackMaterials = [
      { item: "Bricks", quantity: 500, unitCost: 6 },
      { item: "Cement Bags", quantity: 20, unitCost: 350 }
    ];

    const fallbackLabor = [
      { role: "Labor", days: 10, dailyRate: 800 }
    ];

    const fallbackEquipment = [
      { item: "Mixer Machine", quantity: 1, unitCost: 5000 },
      { item: "Scaffolding", quantity: 10, unitCost: 1000 }
    ];

    const subtotal =
      fallbackMaterials.reduce((sum, m) => sum + m.quantity * m.unitCost, 0) +
      fallbackLabor.reduce((sum, l) => sum + l.days * l.dailyRate, 0) +
      fallbackEquipment.reduce((sum, e) => sum + e.quantity * e.unitCost, 0);

    const tax = subtotal * 0.1;
    const totalCost = subtotal + tax;

    return res.status(200).json({
      title,
      clientName,
      clientEmail,
      input,
      materials: fallbackMaterials,
      labor: fallbackLabor,
      equipment: fallbackEquipment,
      notes: "This is a mock AI-generated estimate including equipment.",
      subtotal,
      tax,
      totalCost,
    });
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

