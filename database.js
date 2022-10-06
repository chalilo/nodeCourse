const fs = require("fs");
const _ = require("lodash");

class Database {
  constructor(filepath) {
    this.file = filepath;
  }
  async getAll() {
    try {
      const data = await fs.promises.readFile(`${this.file}`, "utf-8");
      return JSON.parse(data);
    } catch (e) {
      console.log("[ERROR]:", e);
      return { error: "Error" };
    }
  }
  async getById(id) {
    try {
      const data = await fs.promises.readFile(`${this.file}`, "utf-8");
      const jsonParsed = JSON.parse(data);
      const search = jsonParsed.find((el) => el.id == id);
      if(search){
        return search
      } else{
        return false
      }
    } catch (e) {
      console.log("[ERROR]:", e);
      return { error: "Error" };
    }
  }
  async addToDB(objToAdd) {
    try {
      const data = await fs.promises.readFile(`${this.file}`, "utf-8");
      let jsonParsed = JSON.parse(data);
      let objToPush = JSON.parse(JSON.stringify(objToAdd));
      if (jsonParsed.length <= 0) {
        objToPush.id = 1;
        jsonParsed.push(objToPush);
      } else if (
        jsonParsed.length >= 1 &&
        jsonParsed[jsonParsed.length - 1].id == jsonParsed.length
      ) {
        objToPush.id = jsonParsed.length + 1;
        jsonParsed.push(objToPush);
      } else {
        objToPush.id = jsonParsed[jsonParsed.length - 1].id + 1;
        jsonParsed.push(objToPush);
      }
      await fs.promises.writeFile(this.file, JSON.stringify(jsonParsed));
      return jsonParsed[jsonParsed.length - 1];
    } catch (e) {
      console.log("[ERROR]:", e);
      return { error: "Error" };
    }
  }
  async editObj(id, obj) {
    try {
      let search = await this.getById(id);
      if (search) {
        let joined = _.merge({ ...search }, { ...obj });
        let data = await this.getAll();
        let edited = data.map((el) => {
          if (el.id == id) {
            return joined;
          } else {
            return el;
          }
        });
        await fs.promises.writeFile(this.file,JSON.stringify(edited))
        return joined;
      } else {
        return false;
      }
    } catch (e) {
      console.log("[ERROR]:", e);
      return { error: "Error" };
    }
  }
  async deleteById(id){
    try{
        const search = await this.getById(id)
        if (search){
            let jsonParsed = await this.getAll()
            let filtered = jsonParsed.filter(el => el.id != id)
            await fs.promises.writeFile(this.file,JSON.stringify(filtered))
            return {deleted:search}
        }else{
            return false
        }
    }catch(e){
        console.log("[ERROR]: ",e);
        return { error: "Error" };
    }
  }
  async deleteFromItems(id,insideId){
    const search = await this.getById(id)
    if(search){
        const toDelete = search.items.find(el => el.id == insideId)
        if(toDelete){
            let data = await this.getAll()
            let edited = data.map(el => {
                if(el.id == id){
                    let filteredItems = search.items.filter(el => el.id != insideId)
                    el.items = filteredItems
                    return el
                }else{
                    return el
                }
            })
            await fs.promises.writeFile(this.file,JSON.stringify(edited))
            return {deleted:toDelete}
        } else{
            return {error: "Item no encontrado"}
        }
    }else{
        return {error: "Id no existente"}
    }
  }
}

module.exports = Database;
