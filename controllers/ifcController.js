const Ifc = require('../models/Ifc');

// CREATE: Save IFC data with unique survey_id
exports.createIfc = async (req, res) => {
    try {
        const { survey_id, data } = req.body;

        // Validate input
        if (!survey_id || typeof survey_id !== 'string') {
            return res.status(400).json({ error: 'survey_id is required and must be a string' });
        }

        if (!data || !Array.isArray(data)) {
            return res.status(400).json({ error: 'Data is required and must be an array' });
        }

        // Step 1: Check if survey_id already exists
        // const existingIfc = await Ifc.findOne({ where: { survey_id } });
        const existingIfc = await Ifc.find;

        if (existingIfc) {
            return res.status(400).json({ message: `Survey ID '${survey_id}' already exists. No duplicate survey allowed.` });
        }

        // Step 2: Save new IFC record
        const ifc = await Ifc.create({ survey_id, data });

        // Step 3: Return the saved record
        res.status(201).json(ifc);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};


// GET IFC by survey_id
exports.getIfc = async (req, res) => {
    try {
        const { survey_id } = req.params;

        if (!survey_id) {
            return res.status(400).json({ error: 'survey_id is required in the URL' });
        }

        const ifc = await Ifc.findOne({ where: { survey_id } });

        if (!ifc) {
            return res.status(404).json({ message: `No IFC data found for survey_id '${survey_id}'` });
        }

        res.status(200).json(ifc);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};



// Recursive function to search GUID inside nested Children
function findByGuidRecursive(nodes, guid) {
    for (const node of nodes) {
        if (node.Guid === guid) {
            return node;
        }
        if (node.Children && node.Children.length > 0) {
            const found = findByGuidRecursive(node.Children, guid);
            if (found) return found;
        }
    }
    return null;
}

// FIND specific element by GUID
exports.findElementByGuid = async (req, res) => {
    try {
        const { survey_id } = req.params; // IFC record ID
        const { guid } = req.query; // GUID sent by client

        if (!guid && !survey_id) {
            return res.status(400).json({ error: 'GUID and survey_id is required in parameters' });
        }

        const ifc = await Ifc.findOne({ where: { survey_id } });

        // console.log("Ifc data:", ifc)
        if (!ifc) {
            return res.status(404).json({ message: 'IFC file not found' });
        }

        const dataArray = ifc.data || [];

        // console.log("Data array:", dataArray)

        const foundElement = findByGuidRecursive(dataArray, guid);

        if (!foundElement) {
            return res.status(404).json({ message: 'Element not found with provided GUID' });
        }

        res.json(foundElement);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};




// Recursive helper: Find and update node by GUID
function findAndUpdateNode(data, guid, startDate, endDate) {
    for (let node of data) {
        if (node.Guid === guid) {
            node.startDate = startDate;
            node.endDate = endDate;
            return node;
        }
        if (node.Children && node.Children.length > 0) {
            const found = findAndUpdateNode(node.Children, guid, startDate, endDate);
            if (found) return found;
        }
    }
    return null;
}

// Final controller
exports.updateElementDatesByGuid = async (req, res) => {
    try {
        const { survey_id } = req.params;
        const { guid } = req.query;
        const { startDate, endDate } = req.body;

        if (!guid || !survey_id) {
            return res.status(400).json({ error: 'Both GUID and survey_id are required' });
        }
        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Both startDate and endDate are required in body' });
        }

        const ifc = await Ifc.findOne({ where: { survey_id } });

        if (!ifc) {
            return res.status(404).json({ message: 'IFC record not found' });
        }

        // Deep clone
        let clonedData = JSON.parse(JSON.stringify(ifc.data || []));

        const updatedNode = findAndUpdateNode(clonedData, guid, startDate, endDate);

        if (!updatedNode) {
            return res.status(404).json({ message: 'Element with provided GUID not found' });
        }

        //Reassign the entire data object and save
        ifc.data = clonedData;
        await ifc.save(); // Guaranteed to persist

        res.status(200).json({
            message: 'Dates added/updated and saved to DB successfully',
            updatedNode
        });

    } catch (err) {
        console.error('Update failed:', err);
        res.status(500).json({ error: err.message });
    }
};



// Recursive helper to update multiple nodes
function updateMultipleNodes(data, guidsSet, startDate, endDate, updatedNodes = []) {
    for (let node of data) {
        if (guidsSet.has(node.Guid)) {
            node.startDate = startDate;
            node.endDate = endDate;
            updatedNodes.push(node);
        }
        if (node.Children && node.Children.length > 0) {
            updateMultipleNodes(node.Children, guidsSet, startDate, endDate, updatedNodes);
        }
    }
    return updatedNodes;
}

// Controller: Bulk update multiple GUIDs with same dates
exports.bulkUpdateElementDates = async (req, res) => {
    try {
        const { survey_id } = req.params;
        const { guids, startDate, endDate } = req.body;

        if (!survey_id || !Array.isArray(guids) || guids.length === 0) {
            return res.status(400).json({ error: 'survey_id and a non-empty array of GUIDs are required' });
        }

        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Both startDate and endDate are required' });
        }

        const ifc = await Ifc.findOne({ where: { survey_id } });
        if (!ifc) {
            return res.status(404).json({ message: 'IFC record not found' });
        }

        // Clone to trigger Sequelize's change detection
        const dataArray = JSON.parse(JSON.stringify(ifc.data || []));

        // Update all matching nodes
        const updatedNodes = updateMultipleNodes(dataArray, new Set(guids), startDate, endDate);

        if (updatedNodes.length === 0) {
            return res.status(404).json({ message: 'No elements found with provided GUIDs' });
        }

        // Save updated IFC data
        ifc.data = dataArray;
        await ifc.save();

        res.status(200).json({
            message: `Updated ${updatedNodes.length} elements with provided start/end dates`,
            updatedNodes
        });

    } catch (err) {
        console.error('Bulk update error:', err);
        res.status(500).json({ error: err.message });
    }
};

