class AuthorsService{
  constructor(){
    console.log('AuthorsService 实例化....');
  }
  save(param){
    console.log('AuthorsService save...', param);
  }
  delete(param){
    console.log('AuthorsService delete...', param);
  }
  update(param, patch = false){
    console.log('AuthorsService update...', param);
  }
  list(param){
    console.log('AuthorsService list...', param);
  }
}

module.exports = AuthorsService
