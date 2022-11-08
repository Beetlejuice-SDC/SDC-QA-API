const questionModels = require('../models/questionsModels.js');

module.exports = {
  getQuestions: async (req, res) => {
    const productId = req.query.product_id;
    const page = req.query.page || 1;
    const count = req.query.count || 5;

    const getQuestions = await questionModels.getAll(productId, page, count);
    res.status(200).send(getQuestions.rows[0].json_build_object);
    // console.log('Data retrieved');
  },
  addQuestion: async (req, res) => {
    const params = [req.body.product_id, req.body.body, req.body.name, req.body.email, 0];

    await questionModels.post(params);
    res.status(201).send('Question Added');
  },
  incrementHelpful: async (req, res) => {
    const questionId = req.params.questionId;
    await questionModels.putHelpfulness(questionId);
    // console.log('Incremented helpfulness');
    res.sendStatus(204);
  },
  reportQuestion: async (req, res) => {
    const questionId = req.params.questionId;
    await questionModels.putReported(questionId);
    // console.log('Question Reported');
    res.sendStatus(204);
  }
};