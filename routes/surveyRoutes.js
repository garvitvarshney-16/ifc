const express = require('express');
const router = express.Router();
const controller = require('../controllers/surveyController');

router.post('/', controller.createSurvey);
router.get('/:survey_id', controller.getSurvey);
router.put('/:survey_id', controller.updateSurvey);
router.delete('/:survey_id', controller.deleteSurvey);
router.patch('/:survey_id/ifc', controller.updateIfcElement);


module.exports = router;
