const generate_exercises_text = require('./generate_exercises_text');
const latex = require('node-latex')
let fs = require('fs');
let archiver = require('archiver');

const generateTest = async (path, filename, text, root, zipName, lastFileName, token) => {
    await fs.writeFile(".\\" + path + "\\" + filename + '.tex', text, (err) => {
        if (err){
            console.error(err);
            return err.message;
        }
    });

    const tex_input = await fs.createReadStream(".\\" + path + "\\" + filename + '.tex')
    const pdf_output = await fs.createWriteStream(".\\" + path + "\\" + filename + '.pdf')
    const pdf = await latex(tex_input)
    
    await pdf.pipe(pdf_output)
    pdf.on('error', err => {
        console.error(err);
        return err.message;
    })
    await pdf.on('finish', async () => {
        if( filename == lastFileName){
            await zipFiles(root, token, zipName);
        }
    })
}

const generateTests = async (root, zipName, nr, token, fileName1, fileName2, question_txt, answer_txt) => {
    for (let i = 1 ; i <= nr ; i++)
    {
        await generateTest("src\\files\\" + token, fileName1 + i, question_txt, root, zipName, fileName2 + nr, token);
        await generateTest("src\\files\\" + token, fileName2 + i, answer_txt, root, zipName, fileName2 + nr, token);
    }
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
    console.log('folder removed');
}

const zipFiles = async (root, token, zipName) => {
    let archive = archiver("zip", { zlib: { level: 9 } });
    let zip_output = fs.createWriteStream(root + zipName);

    archive.on('error', (err) => {
        if (err) {
            console.error(err);
            return err.message;
        }
    });
    await archive.pipe(zip_output);
    await archive.glob('*.pdf', {cwd: root + token});
    await archive.glob('*.tex', {cwd: root + token});
    await archive.finalize();
    removeFolder(root + token);
}

const createZipFile = async (all_exercises, all_categories, exercises, params, token) => {
    const fileName1 = "Test";
    const fileName2 = "Solution";
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

    let a = "";
    exercises.map((ex) => {
        for (let i = 1 ; i <= ex.nr ; i++)
        {
            let {question, answer} = generate_exercises_text(all_exercises, all_categories, ex.category, ex.title);
            question_text = question_text + question;
            a = a + answer;
        }
        answer_text = question_text + a;
    });

    let question_txt = header + question_text + footer;
    let answer_txt = header + answer_text + footer;

    createFolder("./src/files/" + token);

    await generateTests("./src/files/", zipName, params.number, token, fileName1, fileName2, question_txt, answer_txt);
}

module.exports = createZipFile;