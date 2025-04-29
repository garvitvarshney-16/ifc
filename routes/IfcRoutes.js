const express = require('express');
const router = express.Router();
const controller = require('../controllers/ifcController');

router.post('/', controller.createIfc);
router.get('/:survey_id', controller.getIfc);
router.get('/:survey_id/element', controller.findElementByGuid);
router.patch('/:survey_id/element', controller.updateElementDatesByGuid);
router.patch('/:survey_id/bulk', controller.bulkUpdateElementDates);


module.exports = router;
