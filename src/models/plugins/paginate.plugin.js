/// Paginate returned documents 
const paginate = (schema) => {
  schema.statics.paginate = async function (filter, options) {
    let sort = "";
    
    /// Check if sortBy is has value
    if (options.sortBy) {
      /// Split by sortBy value by comma, then push order type needed
      const sortingCriteria = [];
      options.sortBy.split(",").forEach((sortOption) => {
        const [key, order] = sortOption.split(":");
        sortingCriteria.push((order === "desc" ? "-" : "") + key);
      });
      sort = sortingCriteria.join(" ");
    } else {
      /// Sort by created time, if sortBy value isn't exists
      sort = "createdAt";
    }

    /// Check if limit value is exists and more than zero
    const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
    /// Check if page value is exists and more than zero
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
    /// Count skip value, based on page and limit
    const skip = (page - 1) * limit;

    /// Count filter value
    const countPromise = this.countDocuments(filter).exec();
    /// Get documents based on given sort, skip, and limit value
    let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit);

    /// Check if populate method is called
    if (options.populate) { 
      /// Split populated document
      options.populate.split(",").forEach((populateOption) => {
        docsPromise = docsPromise.populate(
          populateOption.split(".").reverse().reduce((a, b) => ({ path: b, populate: a }))
        );
      });
    }

    /// Execute get document
    docsPromise = docsPromise.exec();
    
    /// Return all executed value above as resolved promise 
    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalResults, results] = values;
      const totalPages = Math.ceil(totalResults / limit);
      const result = {
        results,
        page,
        limit,
        totalPages,
        totalResults,
      };
      return Promise.resolve(result);
    });
  };
};

module.exports = paginate;
