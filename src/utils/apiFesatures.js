
class ApiFeatures {

    constructor(mongooseQuery, queryData) {
        this.mongooseQuery = mongooseQuery;
        this.queryData = queryData
    }

    paginate() {
        let { page, size } = this.queryData;
        if (!page || page <= 0) {
            page = 1
        }
        if (!size || size <= 0) {
            size = 2
        }
        page = parseInt(page)
        size = parseInt(size)

        this.mongooseQuery.limit(size).skip((page - 1) * size)
        return this
    }
    sort() {

        this.mongooseQuery.sort(this.queryData.sort?.replaceAll(",", ' '))
        return this
    }

    search() {
        if (this.queryData.search) {
            this.mongooseQuery.find({
                $or: [
                    { name: { $regex: this.queryData.search, $options: "i" } },
                    { description: { $regex: this.queryData.search, $options: "i" } }

                ]
            })
        }
        return this
    }


    filter() {
        const filterQuery = { ...this.queryData }
        const excludeFromQuery = ['page', 'size', 'search', 'sort', 'fields']
        excludeFromQuery.forEach(key => {
            delete filterQuery[key]
        });
        this.mongooseQuery.find(JSON.parse(JSON.stringify(filterQuery).replace(/(gt|lt|gte|lte|nin|in|eq)/g, match => `$${match}`)))
        return this
    }


    select() {

        this.mongooseQuery.select(this.queryData.fields?.replaceAll(",", ' '))
        return this
    }
}

export default ApiFeatures