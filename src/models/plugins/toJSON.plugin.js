/// Delete last path of object
const deleteAtPath = (obj, path, index) => {
  /// Check if path is last index
  if (index === path.length - 1) {
    delete obj[path[index]];
    return;
  }
  /// Add one index, if path isn't last
  deleteAtPath(obj[path[index]], path, index + 1);
};

/// Transform document results to json
const toJSON = (schema) => {
  let transform;
  
  /// Do json transform, if this plugin is called
  if (schema.options.toJSON && schema.options.toJSON.transform) {
    transform = schema.options.toJSON.transform;
  }

  /// Assign object with transform results
  schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
    transform(doc, ret, options) {
      /// Delete last path on optional and private path
      Object.keys(schema.paths).forEach((path) => {
        if (schema.paths[path].options && schema.paths[path].options.private) {
          deleteAtPath(ret, path.split("."), 0);
        }
      });

      /// Convert id key to string value
      ret.id = ret._id.toString();

      /// Delete selected optional and private path
      delete ret._id;
      delete ret.__v;
      delete ret.createdAt;
      delete ret.updatedAt;

      /// Run transform plugin called
      if (transform) {
        return transform(doc, ret, options);
      }
    },
  });
};

module.exports = toJSON;
