var c = 0;

function util(d, b, s, e, i, r, a) {
    if (s === 0) {
        c = 0;
    }
    if (i === r) {
        return inner(r, b, a);
    }

    return iterate(s, e, r, i, b, d, a);
}

function inner(r, b, a) {
    let arr = new Array(r);
    for (let j = 0; j < r; j++) {
        arr[j] = b[j];
    }
    a[c] = arr;
    c++;
    return a;
}

function iterate(s, e, r, i, b, d, a) {
    for (let j = s; j <= e && e - j + 1 >= r - i; j++) {
        b[i] = d[j];
        a = util(d, b, j + 1, e, i + 1, r, a);
    }
    return a;
}