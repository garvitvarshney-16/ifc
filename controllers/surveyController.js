const Survey = require('../models/Survey');

// Utility: Basic validation
function validateSurveyInput({ survey_id, ifc_data, start_date, end_date }) {
    if (!survey_id || typeof survey_id !== 'string') {
        return 'survey_id is required and must be a string';
    }
    if (!ifc_data || typeof ifc_data !== 'object') {
        return 'ifc_data is required and must be a valid JSON object';
    }
    if (start_date && end_date && new Date(start_date) > new Date(end_date)) {
        return 'start_date must be before end_date';
    }
    return null;
}

// CREATE
exports.createSurvey = async (req, res) => {
    try {
        const { survey_id, ifc_data, start_date, end_date, assigned_to } = req.body;

        const validationError = validateSurveyInput({ survey_id, ifc_data, start_date, end_date });
        if (validationError) return res.status(400).json({ error: validationError });

        const survey = await Survey.create({ survey_id, ifc_data, start_date, end_date, assigned_to });
        res.status(201).json(survey);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// READ
exports.getSurvey = async (req, res) => {
    try {
        const survey = await Survey.findOne({ where: { survey_id: req.params.survey_id } });
        if (!survey) return res.status(404).json({ message: 'Survey not found' });
        res.json(survey);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// FULL UPDATE (replace ifc_data)
exports.updateSurvey = async (req, res) => {
    try {
        const { ifc_data, start_date, end_date, assigned_to } = req.body;

        if (start_date && end_date && new Date(start_date) > new Date(end_date)) {
            return res.status(400).json({ error: 'start_date must be before end_date' });
        }

        const [updated] = await Survey.update(
            { ifc_data, start_date, end_date, assigned_to },
            { where: { survey_id: req.params.survey_id } }
        );

        if (!updated) return res.status(404).json({ message: 'Survey not found' });

        const updatedSurvey = await Survey.findOne({ where: { survey_id: req.params.survey_id } });
        res.json(updatedSurvey);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// PATCH: Update specific key inside ifc_data
exports.updateIfcElement = async (req, res) => {
    try {
        const { survey_id } = req.params;
        const { key, value } = req.body;

        if (!key) return res.status(400).json({ error: 'Key is required to update IFC data' });

        const survey = await Survey.findOne({ where: { survey_id } });
        if (!survey) return res.status(404).json({ message: 'Survey not found' });

        const updatedIfcData = { ...survey.ifc_data, [key]: value };

        await survey.update({ ifc_data: updatedIfcData });

        res.json({ message: `IFC key '${key}' updated`, ifc_data: survey.ifc_data });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// DELETE
exports.deleteSurvey = async (req, res) => {
    try {
        const deleted = await Survey.destroy({ where: { survey_id: req.params.survey_id } });
        if (!deleted) return res.status(404).json({ message: 'Survey not found' });
        res.json({ message: 'Survey deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
