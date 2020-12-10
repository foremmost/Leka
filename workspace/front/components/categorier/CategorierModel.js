import { Model } from '../main/Model.js';
export class CategorierModel extends Model {
    constructor(){
        super();
        const _ = this;
        _.componentName = 'Categorier';

        _.perPage = 25;
        _.dataCast = null;
        _.categoryData = {};
        _.propertyListData = {};
        _.deletedProps = [];

        _.propertyValues = [];
        _.deletedValues = [];
        _.deletedChars = [];
    }
    recalcSort(value,sort){
        const _ = this;
        _.propertyValues.forEach(function (el) {
            if (el['value'] == value){
               el['sort'] = sort;
            }
        });
    }
    hasProperty(value) {
        const _ = this;
        let filtered = _.propertyValues.filter(function (el,index) {
            return  el['value'] == value;
        });
        return filtered.length > 0 ;
    }
    removePropertyValue(value){
        const _ = this;
        _.propertyValues.forEach(function (el,index) {
            if (el['value'] == value){
               let prop =  _.propertyValues.splice(index,1);
                _.deletedValues.push(prop[0]);
            }
        });
    }
    addPropertyValue(value,sort){
        this.propertyValues.push({
            'value': value,
            'sort': sort
        });
    }
    editPropertyValue(value,newValue,prop='value'){
        const _ = this;
        _.propertyValues.forEach(function (el) {
            if (el[prop] == value){
                el[prop] = newValue;
            }
        });
    }
    async clearCategoryData(){
        const _ = this;
        _.categoryData = {};
    }
    async getParentCategories(parentData={page: 1}){
        const _ = this;
        let response = await _.handler({
            method: 'getParentCategories',
            data:{
                currentPage: parentData['page'],
                perPage: _.perPage,
            }
        },'JSON');
        return (response === '') ? [] : response;
    }
    async getCatChildes(childData = {}){
        const _ = this;
        let response = await _.handler({
            method: 'getCatChildes',
            type:'class',
            data:childData

        },'JSON');
        return (response === '') ? [] : response;
    }
    getCategory(catData = {}){
        const _ = this;
        return new Promise(async function (resolve) {
            let response = await _.handler({
                method: 'getCat',
                data: catData
            },'JSON');
            if(response[0])  _.categoryData = response[0];
            resolve( (response === '') ? [] : response);
        })

    }
    async getParentCategory(catData = {}){
        const _ = this;
        let response = await _.handler({
            method: 'getCat',
            data: catData
        },'JSON');
        return (response === '') ? [] : response;
    }
    async getPropsList(catData = {}){
        const _ = this;
        let response = await _.handler({
            method: 'getPropsList',
            type: 'class',
            data: catData
        },'JSON');
        _.propsList = response;
        return (response === '') ? [] : response;
    }
    async searchParent(catData = {}){
        const _ = this;
        catData['page'] = 1;
        catData['perPage'] = _.perPage;
        let response = await _.handler({
            method: 'search',
            type: 'class',
            data: catData
        },'JSON');
        return (response === '') ? [] : response;
    }
    //
    async saveCat(){
	    const _ = this;
	    let response = await _.handler({
			    method: 'saveCat',
		      type: 'class',
			    data: _.categoryData
		    },'JSON'
	    );
	    return response;
    }
    async updateCat(){
	    const _ = this;
        _.categoryData['deleted'] = _.deletedChars;
	    let response = await _.handler({
			    method: 'updateCat',
		      type: 'class',
			    data: _.categoryData
		    },'JSON'
	    );
	    //console.log(response);
	    return response;
    }
    //
    async getPropertiesLists(){
        const _ = this;
        let response = await _.handler({
            method: 'getPropertiesLists',
            type: 'class',
            data: null
        },'JSON');
        _.propertiesLists = response;
        return (response === '') ? [] : response;
    }
    async getCurrentPropList(listId){
        const _ = this;
        let response = await _.handler({
            method: 'getCurrentPropList',
            type: 'class',
            data: {id:listId}
        },'JSON');
        return response;
    }
    getPropertiesList(listId){
        const _ = this;
        let list = _.propertiesLists.filter( (el)=>el['id'] == listId);
        return list[0];
    }

    async updatePropertyList(propertyListData){
        const _ = this;
        propertyListData['props'] = _.propertyValues;
        propertyListData['deleted'] = _.deletedValues;
        console.log(propertyListData)
        let response = await _.handler({
                method: 'updatePropertyList',
                type: 'class',
                data: propertyListData
            },'JSON'
        );
        console.log(response);
        return response;
    }
    async savePropertyList(propertyListData){
        const _ = this;
        propertyListData['props'] = _.propertyValues;
        let response = await _.handler({
                method: 'savePropertyList',
                type: 'class',
                data: propertyListData
            },'JSON'
        );
        return response;
    }

    deleteProperty(propertyId){
    	const _ = this;
	    return _.handler({
				    method: 'deleteProperty',
				    type: 'class',
				    data: {
				    	id: propertyId
				    }
			    },'JSON'
	    );
    }

}