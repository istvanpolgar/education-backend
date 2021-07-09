const importModules = require('import-modules');

const modules = importModules('exercises');

const generate_exercises = (exercises, categories, category, exercise) => {
    let ex_index = 0;
    let cat_index = 0;

    categories.forEach( (cat,i) => {
        if( cat == category )
            cat_index = i;
    });
    exercises.forEach( cat => {
        if( cat.title == category )
        {
            cat.tips.forEach((ex,j) => {
                if( ex.name == exercise )
                    ex_index = j;
            })
        }
    })

    const {question, answer} = modules['category' + (cat_index + 1)](ex_index + 1);

    return {
        question: question, 
        answer: answer
    };
}

module.exports = generate_exercises;