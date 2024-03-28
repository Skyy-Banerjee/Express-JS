const express = require('express');
const router = express.Router();

const {
    getPeople,
    createPerson,
    createPersonPostMan,
    updatePerson,
    deletePerson
} = require('../controllers/people');

// //get/read
// router.get('/', getPeople)

// //post/send
// router.post('/', createPerson);

// router.post('/postman', createPersonPostMan)

// //PUT
// router.put('/:id', updatePerson);

// //delete
// router.delete('/:id', deletePerson);

//! Another way (shorter than the above):
router.route('/').get(getPeople).post(createPerson)
router.route('/postman').post(createPersonPostMan)
router.route('/:id').put(updatePerson).delete(deletePerson);

module.exports = router;
