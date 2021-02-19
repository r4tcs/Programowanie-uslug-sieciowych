export class Message {
  value = '';
  userName = '';
  file = null;
  fileName = '';
  fileType = '';

  constructor(value, userName, file, fileName, fileType){
    this.value = value;
    this.userName = userName;
    this.file = file;
    this.fileName = fileName;
    this.fileType = fileType;
  }
}
