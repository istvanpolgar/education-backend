const getSign = (value) => {
    if (value >= 0)  return "+";
    else             return "-";
}

const getSignedInt = (number) => {
    if (number == 0)
        return "";
    return getSign(number) + Math.abs(number);
}

const getSignedInt2 = (number,one) => {
    if (number == 0)
        return "";
    if (number == 1 && one)
        return "+";
    if (number == -1 && one)
        return "-";
    return getSign(number) + Math.abs(number);
}

const getUnsignedInt = (number,zero,one) => {
    if (number == 0 && !zero)
        return "";
    if (number == 0 && zero)
        return "0";
    if (number == 1 && one)
        return "";
    if (number == -1 && one)
        return "-";
    if (number > 0)
        return Math.abs(number);
    return getSign(number) + Math.abs(number);
}

const getSignedFrac = (numerator, denominator) => {
    if (numerator == 0)
        return "";
    if (denominator == 0)
        return "undefind";
    if (numerator%2 == denominator%2)
        return getSign(1) + "\\frac{" + Math.abs(numerator) + "}{" + Math.abs(denominator) + "}";
    return getSign(-1) + "\\frac{" + Math.abs(numerator) + "}{" + Math.abs(denominator) + "}";
}

const getUnsignedFrac = (numerator, denominator, zero) => {
    if (numerator == 0 && zero)
        return "0";
    if (numerator == 0 && !zero)
        return "";
    if (denominator == 0)
        return "undefind";
    if (numerator * denominator > 0)
        return "\\frac{" + Math.abs(numerator) + "}{" + Math.abs(denominator) + "}";
    return getSign(-1) + "\\frac{" + Math.abs(numerator) + "}{" + Math.abs(denominator) + "}";
}

const getLNKO = (a,b) => {
    if (a == 0 || b == 0)
        return -1;
    while(a != b)
    {
        if (a > b)  a=a-b;
        else        b=b-a;
    }
    return a;
}

const getSimplifiedFrac = (numerator, denominator) => {
    let lnko = getLNKO(Math.abs(numerator),Math.abs(denominator));

    if (numerator%denominator == 0 && lnko!=-1)
        return "=" + getUnsignedInt(numerator/denominator);
    
    if (lnko == -1 || lnko == 1)
        return "";

    numerator /= lnko;
    denominator /= lnko;
    return "=" + getUnsignedFrac(numerator, denominator);
}

const getSqrtFrac = (numerator, denominator) => {
    numerator = Math.abs(numerator);
    denominator = Math.abs(denominator)
    let lnko = getLNKO(numerator,denominator);

    if (numerator%denominator == 0 && lnko!=-1)
        return getFromSqrt(numerator/denominator);
    
    if (lnko == -1 || lnko == 1)
        return "\\frac{" + numerator + "\\sqrt{" + denominator + "}}{" + denominator + "}";

    numerator /= lnko;
    denominator /= lnko;
    return "\\frac{" + numerator + "\\sqrt{" + denominator + "}}{" + denominator + "}";
}

const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}

const getFromSqrt = (number) => {
    if(Math.sqrt(number) % 1 === 0)
        return Math.sqrt(number);
    else
    {
        let i = 2;
        let k = 1;
        while ( i*i < number)
        {
            if( number % (i*i) === 0 )
                k = i * i;
            i++;
        }
        if( k == 1 )
            return "";
        else
            return Math.sqrt(k) + "\\sqrt{" + (number / k) + "}"; 
    }
}

const getSolution = (minus_b, delta, denumerator, sign) => {
    if(Math.sqrt(delta) % 1 === 0)
    {
        let numerator;
        if(sign == "+")
            numerator = minus_b + Math.sqrt(delta);
        else
            numerator = minus_b - Math.sqrt(delta);
        return "=" + getUnsignedFrac(numerator,denumerator) + getSimplifiedFrac(numerator,denumerator);
    }
    else
    {
        if(denumerator < 0)
        {
            minus_b = -minus_b;
            if(sign == "+")
                sign = "-";
            else
                sign = "+";
            denumerator = -denumerator;
        }
        let i = 2;
        let k = 1;
        let resp = "";
        while ( i*i < delta)
        {
            if( delta % (i*i) === 0 )
                k = i;
            i++;
        }
        let d = getLNKO(Math.abs(minus_b),k);
        if(d !== 1) {
            let lnko = getLNKO(d, Math.abs(denumerator));
            if(lnko !== 1) {
                if(sign == "+"){
                    resp = resp + "=\\frac{" + lnko + "(" + getUnsignedInt(minus_b/lnko) + "+" + getUnsignedInt(k/lnko,false,true) + "\\sqrt{" + (delta/(k*k)) + "})}{" + getUnsignedInt(denumerator) + "}";
                    if(denumerator/lnko === 1)
                        resp = resp + "=" + getUnsignedInt(minus_b/lnko) + "+" + getUnsignedInt(k/lnko,false,true) + "\\sqrt{" + (delta/(k*k)) + "}";
                    else
                        resp = resp + "=\\frac{" + getUnsignedInt(minus_b/lnko) + "+" + getUnsignedInt(k/lnko,false,true) + "\\sqrt{" + (delta/(k*k)) + "}}{" + getUnsignedInt(denumerator/lnko) + "}";
                } else {
                    resp = resp + "=\\frac{" + lnko + "(" + getUnsignedInt(minus_b/lnko) + "-" + getUnsignedInt(k/lnko,false,true) + "\\sqrt{" + (delta/(k*k)) + "})}{" + getUnsignedInt(denumerator) + "}";
                    if(denumerator/lnko === 1)
                        resp = resp + "=" + getUnsignedInt(minus_b/lnko) + "-" + getUnsignedInt(k/lnko,false,true) + "\\sqrt{" + (delta/(k*k)) + "}";
                    else
                        resp = resp + "=\\frac{" + getUnsignedInt(minus_b/lnko) + "-" + getUnsignedInt(k/lnko,false,true) + "\\sqrt{" + (delta/(k*k)) + "}}{" + getUnsignedInt(denumerator/lnko) + "}";
                }
            }
        }
        return resp;
    }
}

const question1 = (a,b,c) => {
    let text = "\\begin{fel}\n";
    if(b != 0)
        text = text + "Oldd meg a $" + getUnsignedInt(a,false,true) + "x^2" + getSignedInt2(b,true) + "x" + getSignedInt(c) + "=0$ egyenletet a valós számok halmazán! \n";
    else
        text = text + "Oldd meg a $" + getUnsignedInt(a,false,true) + "x^2" + getSignedInt(c) + "=0$ egyenletet a valós számok halmazán! \n";
    text = text + "\\end{fel} \n\n";
    return text;
}

const answer1 = (a,b,c) => {
    let text = "\n\\begin{meg}\n ";
    if(b != 0)
        text = text + "$" + getUnsignedInt(a,false,true) + "x^2" +  getSignedInt2(b,true) + "x" + getSignedInt(c) + "=0$ \\\\\n";
    else
        text = text + "$" + getUnsignedInt(a,false,true) + "x^2" + getSignedInt(c) + "=0$ \\\\\n";

    if( b == 0) {
        if ( c == 0)
            text = text + "$x^2=0 \\Leftrightarrow x_1=x_2=0$";
        else{
            text = text + "$" + getUnsignedInt(a,false,true) + "x^2=" + getSignedInt(-c);
            if( -c/a < 0 )
                text = text + "$\\\\\nAz egyenletnek nincs megoldása\n";
            else
            {
                text = text + " \\Leftrightarrow "
                text = text + "x^2=" + getUnsignedFrac(-c,a) + getSimplifiedFrac(-c,a) + " \\Leftrightarrow ";
                text = text + "x_{1,2}=\\pm" + getSqrtFrac(-c,a) + "$";
            }
        }
    } else {
        if( c == 0 ){
            text = text + "$x(" + getUnsignedInt(a,false,true) + "x" + getSignedInt(b) + ")=0 \\Leftrightarrow \\\\x_1=0\\\\";
            text = text + getUnsignedInt(a,false,true) + "x" + getSignedInt(b) + "=0 \\Leftrightarrow";
            text = text + getUnsignedInt(a,false,true) + "x=" + getUnsignedInt(-b,true);
            if (a != 1)
            {
                text = text + "\\Leftrightarrow \n"; 
                if (a != -1)
                    text = text + "x=" + getUnsignedFrac(-b,a,true) + "\n";
                else
                    text = text + "x_2";
                text = text + getSimplifiedFrac(-b,a);
            }
            text = text + "$\n";
        } else {
            let delta = b*b-4*a*c;
            text = text + "Az egyenlet diszkriminánsa: $\\Delta=b^2-4ac=" + delta + "$ \\\\\n";
            if(delta < 0)
                text = text + "Az egyenletnek nincs megoldása\n";
            if(delta == 0)
                text = text + "$x_1=x_2=\\frac{-b}{2a}=" + getSignedFrac(-b,2*a) + getSimplifiedFrac(-b,2*a) + "$ \\\\\n";
            if(delta > 0)
            {
                text = text + "$x_1=\\frac{-b+\\sqrt{\\Delta}}{2a}=";
                text = text + "\\frac{" + getUnsignedInt(-b) + "+\\sqrt{" + delta + "}}{" + getUnsignedInt(2*a) + "}";
                if(getFromSqrt(delta) !== "")
                {
                    text = text + "=\\frac{" + getUnsignedInt(-b) + "+" + getFromSqrt(delta) + "}{" + getUnsignedInt(2*a) + "}";
                    text = text + getSolution(-b, delta, 2*a, "+") + "$\n";
                }
                else
                    text = text + "$\n";

                text = text + "\\\\";

                text = text + "$x_2=\\frac{-b-\\sqrt{\\Delta}}{2a}=";
                text = text + "\\frac{" + getUnsignedInt(-b) + "-\\sqrt{" + delta + "}}{" + getUnsignedInt(2*a) + "}";
                if(getFromSqrt(delta) !== "")
                {
                    text = text + "=\\frac{" + getUnsignedInt(-b) + "-" + getFromSqrt(delta) + "}{" + getUnsignedInt(2*a) + "}";
                    text = text + getSolution(-b, delta, 2*a, "-") + "$\n";
                }
                else
                    text = text + "$\n";
            }
        }
    }
    text = text + "\n\\end{meg}\n";
    return text;
}

const generated_exercise = (type) => {
    let question = "";
    let answer = "";
    switch(type)
    {
        case 1: {
            let a = getRandomInt(-10,10);
            while(a === 0)
                a = getRandomInt(-10,10);
            const b = getRandomInt(-10,10);
            const c = getRandomInt(-10,10);
            question = question + question1(a,b,c); 
            answer = answer + answer1(a,b,c);
            break;
        }
        default: question = "Exercise is undefind"; answer = "Exercise is undefind";
    }
    return {
        question: question, 
        answer: answer
    };
};

module.exports = generated_exercise;