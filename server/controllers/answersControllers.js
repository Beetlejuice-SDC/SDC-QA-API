const answerModels = require('../models/answersModels.js');

module.exports = {
  getAnswers: async (req, res) => {
    const questionId = req.params.questionId;
    const page = req.query.page || 1;
    const count = req.query.count || 5;

    const getAnswers = await answerModels.getAll(questionId, page, count);
    res.status(200).send(getAnswers.rows[0].json_build_object);
    console.log('Data retrieved');
  },
  addAnswer: async (req, res) => {
    const photos = req.body.photos;
    const params = [req.params.questionId, req.body.body, req.body.name, req.body.email, 0];
    const addAnswer = await answerModels.post(params);
    const answerId = addAnswer.rows[0].id;
    photos.forEach((url) => {
      answerModels.postPhotos(answerId, `'${url}'`);
    });
    res.status(201).send('Answer added');
  },
  incrementAnswerHelpful: async (req, res) => {
    const answerId = req.params.answerId;
    await answerModels.putHelpfulness(answerId);
    console.log('Incremented helpfulness');
    res.sendStatus(204);
  },
  reportAnswer: async (req, res) => {
    const answerId = req.params.answerId;
    await answerModels.putReported(answerId);
    console.log('Answer Reported');
    res.sendStatus(204);
  }
};