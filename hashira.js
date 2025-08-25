import { readFileSync } from "fs";



function decodeBase(str, base) {
    let result = 0n;
    const bigBase = BigInt(base);
    for (let char of str) {
        const digit = BigInt(parseInt(char, 36));
        if (digit >= bigBase) {
            throw new Error(`Invalid digit '${char}' for base ${base}`);
        }
        result = result * bigBase + digit;
    }
    return result;
}





function lagrange(points, x0) {
    const n = points.length;
    const denom = points.map((p, i) =>
        points.reduce((d, q, j) => i !== j ? d * (p.x - q.x) : d, 1n)
    );

    return points.reduce((res, p, i) => {
        const num = points.reduce((n, q, j) => i !== j ? n * (x0 - q.x) : n, 1n);
        return res + (p.y * num) / denom[i];
    }, 0n);

}

const files = ["data1.json", "data2.json"];

for (const file of files) {
    const data = JSON.parse(readFileSync(file, "utf-8"));
    let points = [];
    for (const key in data) {
        if (key !== "keys") {
            const x = BigInt(key);
            const base = parseInt(data[key].base);
            const value = data[key].value;
            const y = decodeBase(value, base);
            points.push({ x, y });
        }
    }
    const k = data.keys.k;
    const chosenPoints = points.slice(0, k);

    const c = lagrange(chosenPoints, 0n);

    console.log(`Secret for ${file}=`, c.toString());
}




