const importModules = require('import-modules');

const modules = importModules('exercises');

const generate_exercises = (exercises, categories, category, exercise) => {
    console.log(categories);
    console.log(exercises.tips);
    console.log(category);
    console.log(exercise);
    let ex_index = 0;
    let cat_index = 0;

    categories.forEach( (cat,i) => {
        if( cat == category )
            cat_index = i;
    });
    exercises.forEach( cat => {
        if( cat.title == category )
        {
            console.log(cat);
            cat.tips.forEach((ex,j) => {
                if( ex.name == exercise )
                    ex_index = j;
            })
        }
    })
    console.log(cat_index + 1);
    console.log(ex_index + 1);
    return modules['category' + (cat_index + 1)](ex_index + 1);
}

module.exports = generate_exercises;