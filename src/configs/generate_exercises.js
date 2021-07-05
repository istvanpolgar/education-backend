const importModules = require('import-modules');

const modules = importModules('exercises');

const generate_exercises = (category, exercise) => {
    console.log(modules);
    console.log(modules['category' + category](exercise));
}

module.exports = generate_exercises;