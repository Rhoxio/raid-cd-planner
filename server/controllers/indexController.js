const indexController = {
  show(req, res){
    res.render('index.html');
  }
}

module.exports = {
    controller: indexController
} 