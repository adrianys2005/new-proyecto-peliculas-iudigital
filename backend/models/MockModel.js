const fs = require('fs');
const path = require('path');

const generateObjectId = () => {
    return Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
};

class MockQuery {
    constructor(data, modelName) {
        this.data = data;
        this.modelName = modelName;
    }

    sort(options) {
        if (!Array.isArray(this.data)) return this;
        if (options && typeof options === 'object') {
            const key = Object.keys(options)[0];
            const direction = options[key]; // 1 o -1
            this.data.sort((a, b) => {
                const valA = a[key] || '';
                const valB = b[key] || '';
                if (valA < valB) return -1 * direction;
                if (valA > valB) return 1 * direction;
                return 0;
            });
        }
        return this;
    }

    populate(field) {
        const populateMap = {
            generoPrincipal: 'genres',
            directorPrincipal: 'directors',
            productora: 'producers',
            tipo: 'types'
        };
        
        const targetFile = populateMap[field];
        if (targetFile) {
            const refPath = path.join(__dirname, `../data/${targetFile}.json`);
            let refData = [];
            if (fs.existsSync(refPath)) {
                refData = JSON.parse(fs.readFileSync(refPath, 'utf-8'));
            }
            
            const populateItem = (item) => {
                if (!item) return item;
                const refId = item[field];
                if (refId) {
                    const populated = refData.find(r => r._id === refId.toString() || r._id === refId);
                    return { ...item, [field]: populated || refId };
                }
                return item;
            };

            if (Array.isArray(this.data)) {
                this.data = this.data.map(populateItem);
            } else if (this.data && typeof this.data === 'object') {
                // Si la data es un MockModelInstance, convertimos a objeto plano para poblar
                const plainItem = this.data.toObject ? this.data.toObject() : this.data;
                this.data = populateItem(plainItem);
            }
        }
        return this;
    }

    // Método then permite usar await directamente sobre la consulta
    then(onfulfilled, onrejected) {
        return Promise.resolve(this.data).then(onfulfilled, onrejected);
    }
}

class MockModelInstance {
    constructor(modelClass, data) {
        this._modelClass = modelClass;
        Object.assign(this, data);
        if (!this._id) {
            this._id = generateObjectId();
        }
        if (!this.fechaCreacion) {
            this.fechaCreacion = new Date().toISOString();
        }
        this.fechaActualizacion = new Date().toISOString();
    }

    toObject() {
        const obj = { ...this };
        delete obj._modelClass;
        return obj;
    }

    async save() {
        const list = this._modelClass.read();
        const index = list.findIndex(item => item._id === this._id);
        
        const saveObj = this.toObject();

        // Aplicar campos por defecto
        if (this._modelClass.defaultFields) {
            for (const [key, val] of Object.entries(this._modelClass.defaultFields)) {
                if (saveObj[key] === undefined) {
                    saveObj[key] = val;
                }
            }
        }

        if (index >= 0) {
            saveObj.fechaActualizacion = new Date().toISOString();
            list[index] = saveObj;
        } else {
            list.push(saveObj);
        }
        
        this._modelClass.write(list);
        Object.assign(this, saveObj);
        return this;
    }
}

class MockModel {
    constructor(name, defaultFields = {}) {
        this.name = name;
        this.defaultFields = defaultFields;
        this.filePath = path.join(__dirname, `../data/${name.toLowerCase()}s.json`);
        this.initFile();
        
        // Retornar función constructora para simular Mongoose: new Model(data)
        const self = this;
        const ctor = function(data) {
            return new MockModelInstance(self, data);
        };
        
        // Métodos estáticos
        ctor.find = this.find.bind(this);
        ctor.findById = this.findById.bind(this);
        ctor.findOne = this.findOne.bind(this);
        ctor.findByIdAndDelete = this.findByIdAndDelete.bind(this);
        ctor.deleteMany = this.deleteMany.bind(this);
        ctor.insertMany = this.insertMany.bind(this);
        
        return ctor;
    }

    initFile() {
        const dir = path.dirname(this.filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, JSON.stringify([]));
        }
    }

    read() {
        try {
            if (!fs.existsSync(this.filePath)) return [];
            return JSON.parse(fs.readFileSync(this.filePath, 'utf-8'));
        } catch (e) {
            return [];
        }
    }

    write(data) {
        fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
    }

    find() {
        const data = this.read();
        return new MockQuery(data, this.name);
    }

    findById(id) {
        const data = this.read();
        const item = data.find(r => r._id === id.toString() || r._id === id);
        const instance = item ? new MockModelInstance(this, item) : null;
        return new MockQuery(instance, this.name);
    }

    findOne(query) {
        const data = this.read();
        const item = data.find(r => {
            return Object.entries(query).every(([key, val]) => r[key] === val);
        });
        const instance = item ? new MockModelInstance(this, item) : null;
        return new MockQuery(instance, this.name);
    }

    async findByIdAndDelete(id) {
        const data = this.read();
        const index = data.findIndex(r => r._id === id.toString() || r._id === id);
        if (index === -1) return null;
        const deleted = data.splice(index, 1)[0];
        this.write(data);
        return new MockModelInstance(this, deleted);
    }

    async deleteMany(query = {}) {
        this.write([]);
        return { deletedCount: 0 };
    }

    async insertMany(array) {
        const instances = array.map(item => new MockModelInstance(this, item));
        const saveObjs = instances.map(inst => {
            const obj = inst.toObject();
            for (const [key, val] of Object.entries(this.defaultFields)) {
                if (obj[key] === undefined) {
                    obj[key] = val;
                }
            }
            return obj;
        });
        this.write(saveObjs);
        return instances;
    }
}

module.exports = MockModel;
