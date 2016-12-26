class ImagesService{
  constructor(){
    console.log('ImagesService 实例化....');
  }
  save(param){
    console.log('ImagesService save...', param);
  }
  delete(param){
    console.log('ImagesService delete...', param);
  }
  update(param, patch = false){
    console.log('ImagesService update...', param);
  }
  list(param){
    console.log('ImagesService list...', param);
  }
}

module.exports = ImagesService
