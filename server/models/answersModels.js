const db = require('../database/postgres.js');

module.exports = {
  getAll: async (questionId, page, count) => {
    const queryStr = `SELECT
   json_build_object(
  'question', ${questionId},
  'page', ${page},
  'count', ${count},
  'results', (SELECT json_agg(
    json_build_object(
      'answer_id', id,
      'body', body,
      'date', date_written,
      'answerer_name', answerer_name,
      'helpfulness', helpfulness,
      'photos', (SELECT COALESCE(json_agg(
        json_build_object(
          'id', id,
          'url', url
        )
      ), '[]'::json) FROM answers_photos WHERE answer_id = answers.id)
    )
  ) FROM answers WHERE question_id = ${questionId} LIMIT ${count} OFFSET ${(page - 1) * count})
)`;
    const getAnswers = await db.query(queryStr);
    return getAnswers;
  },
  post: async (params) => {
    const queryStr = `INSERT INTO answers (question_id, body, date_written, answerer_name, answerer_email, helpfulness)
    VALUES ($1, $2, to_timestamp(${Date.now() / 1000}), $3, $4, $5) RETURNING id`;
    const addAnswer = await db.query(queryStr, params);
    return addAnswer;
  },
  postPhotos: async (answerId, url) => {
    const queryStr = `INSERT INTO answers_photos (answer_id, url)
    VALUES (${answerId}, ${url})`;
    const addPhotos = await db.query(queryStr);
    return addPhotos;
  },
  putHelpfulness: async (answerId) => {
    const queryStr = `UPDATE answers SET helpfulness = helpfulness + 1 WHERE id = ${answerId}`;
    const incrementHelpful = await db.query(queryStr);
    return incrementHelpful;
  },
  putReported: async (answerId) => {
    const queryStr = `UPDATE answers SET reported = true WHERE id = ${answerId}`;
    const reportQuestion = await db.query(queryStr);
    return reportQuestion;
  }
};