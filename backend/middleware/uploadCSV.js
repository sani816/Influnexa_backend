import multer from "multer";


const storage = multer.diskStorage({

  destination(req,file,cb){
    cb(null,"uploads");
  },

  filename(req,file,cb){
    cb(
      null,
      Date.now()+"-"+file.originalname
    );
  }

});


const uploadCSV = multer({
  storage,
  fileFilter(req,file,cb){

    if(
      file.mimetype === "text/csv" ||
      file.originalname.endsWith(".csv")
    ){
      cb(null,true);
    }
    else{
      cb(new Error("Only CSV files allowed"));
    }

  }
});


export default uploadCSV;