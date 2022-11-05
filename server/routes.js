const { getQuestions, addQuestion, incrementHelpful, reportQuestion } = require('./controllers/questionsControllers.js');
const { getAnswers, addAnswer, incrementAnswerHelpful, reportAnswer } = require('./controllers/answersControllers.js');
const router = require('express').Router();

//Questions
router.get('/questions', getQuestions);
router.post('/questions', addQuestion);
router.put('/questions/:questionId/helpful', incrementHelpful);
router.put('/questions/:questionId/report', reportQuestion);

//Answers
router.get('/questions/:questionId/answers', getAnswers);
router.post('/questions/:questionId/answers', addAnswer);
router.put('/answers/:answerId/helpful', incrementAnswerHelpful);
router.put('/answers/:answerId/report', reportAnswer);

module.exports = router;