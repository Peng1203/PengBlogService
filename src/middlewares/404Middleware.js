/**
 * 路由 404 中间件
 * @author Peng
 * @date 2023-02-20
 * @param {any} req
 * @param {any} res
 * @param {any} next
 * @returns {void}
 */

function notFound(req, res, next) {
  res.status(404).json({
    status: 'error',
    message: 'Resource not found',
    data: null
  });
}

module.exports = notFound;