const { execSync } = require('child_process');
const generate_exercises = require('./generate_exercises');
let fs = require('fs');
let path = require('path');
let archiver = require('archiver');

const generateTest = (path, filename, extention, text) => {
    fs.writeFileSync(".\\" + path + "\\" + filename + extention, text, 
    (err) => {
        if (err) 
            return err;
    });

    execSync( "pdflatex.exe -output-directory=" + path + " " + path + "\\" + filename + extention, 
    (error, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return error.message;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return stderr;
        }
    });
}

const createFolder = (dirName) => {
    if (!fs.existsSync(dirName)){
        fs.mkdirSync(dirName);
    }
}

const removeFolder = (dirName) => {
    if (fs.existsSync(dirName)){
        fs.rmSync(dirName, { recursive: true });
    }
}

const zipFiles = async (root, dir, zipName) => {
    let archive = archiver("zip", { zlib: { level: 9 } });
    let output = fs.createWriteStream(root + zipName);
    
    archive.on('error', (err) => {
        if (err) throw err;
    });

    await archive.pipe(output);
    await archive.glob('*.pdf', {cwd: root + dir});
    await archive.finalize();
    removeFolder("./src/files/" + dir);
}

const createTxt = (exercises, params, token) => {
    const TEXextention = ".tex";
    const fileName1 = "Feladatlap";
    const fileName2 = "Megoldókulcs";
    let zipName = token + '.zip';
    let question_text = "";
    let answer_text = "";

    let header =  "\\documentclass[12pt]{article}\n" + 
                    "\\usepackage{color}\n" +
                    "\\usepackage{amsmath, geometry}\n" +
                    "\\usepackage{amsfonts}\n" +
                    "\\usepackage{amssymb}\n" +
                    "\\usepackage[utf8]{inputenc}\n" +
                    "\\usepackage[magyar]{babel}\n" +
                    "\\usepackage{multicol}\n" +
                    "\\usepackage{enumitem}\n" +
                    "\\usepackage{pgf,tikz}\n" +
                    "\\usepackage{mathrsfs}\n" +
                    "\\usepackage{fancyhdr}\n" +
                    "\\usetikzlibrary{arrows}\n" +
                    "\\newtheorem{fel}{Feladat}\n" +
                    "\\newtheorem{meg}{Megoldás}\n" +
                    "\\newtheorem{megj}{Megjegyzés}\n" +
                    "\\usepackage{cite}\n" +
                    "\\usetikzlibrary{arrows}\n" +
                    "\\usetikzlibrary[patterns]\n" +
                    "\\geometry{\n" +
                    "a4paper,\n" +
                    "total={170mm,257mm},\n" +
                    "left=20mm,\n" +
                    "top=20mm,}\n" +
                    "\\thispagestyle{fancy}\n" +
                    "\\fancyfoot[C]{" + 
                    "\n" + `${params.begin}` + " - " + `${params.end}` + "\n}\n" +
                    "\\fancyhead[C]{";
    if(params.class)
        header = header + "\n\\title{" + `${params.title}` + " - " + `${params.class}` + " osztály \\vspace{-3ex}}\n";
    else
        header = header + "\n\\title{" + `${params.title}` + " \\vspace{-3ex}}\n";
    header =    header +
                "\\date{" + `${params.date}` + "} \n" + 
                "\\maketitle \n" +
                "\\vspace{-5ex}\n}\n" +
                "\\renewcommand{\\footrulewidth}{1pt} \n" +
                "\\setlength{\\headheight}{150pt} \n" +
                "\\setlength{\\textheight}{600pt} \n" +
                "\\begin{document}\n\n";
    if(params.description)
    {
        header =    header + 
                    "\\begin{description}\n\\item{\n" +
                    "Leírás: " + `${params.description}\n}\n` + 
                    "\\end{description}\n\n";
    }

    const footer = "\n\n\\end{document}\n";

    exercises.map( ex => {
        let a = "";
        for (let i = 1 ; i <= ex.nr ; i++)
        {
            let {question, answer} = generate_exercises(ex.category, ex.title);
            question_text = question_text + question;
            a = a + answer;
        }
        answer_text = question_text + a;
    });

    let question_txt = header + question_text + footer;
    let answer_txt = header + answer_text + footer;

    createFolder("./src/files/" + token);
    
    for (let i = 1 ; i <= params.number ; i++)
    {
        generateTest("src\\files\\" + token, fileName1 + i, TEXextention, question_txt);
        generateTest("src\\files\\" + token, fileName2 + i, TEXextention, answer_txt);
    }

    zipFiles("./src/files/", token, zipName);
}

module.exports = createTxt;