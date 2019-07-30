// Much of this file was adapted from code written by Garett Ridge for the library tiny-graphics.js

class Vec extends Float32Array {
    copy() {
        return Vec.from(this)
    }
    equals(b) {
        return this.every((x, i) => x == b[i])
    }
    plus(b) {
        return this.map((x, i) => x + b[i])
    }
    minus(b) {
        return this.map((x, i) => x - b[i])
    }
    mult_pairs(b) {
        return this.map((x, i) => x * b[i])
    }
    scale(s) {
        this.forEach((x, i, a) => a[i] *= s)
    }
    times(s) {
        return this.map(x => s * x)
    }
    randomized(s) {
        return this.map(x => x + s * (Math.random() - .5))
    }
    static random(d, l=0, h=1) {
        return Vec.of(...Array(d).fill(0).map(x => l + (h - l) * Math.random()));
    }
    mix(b, s) {
        return this.map((x, i) => (1 - s) * x + s * b[i])
    }
    squarednorm() {
        return this.dot(this);
    }
    norm() {
        return Math.sqrt(this.dot(this))
    }
    normalized() {
        return this.times(1 / this.norm())
    }
    normalize() {
        this.scale(1 / this.norm())
    }
    // Optimized arithmetic unrolls loops for vectors of length <= 4.
    dot(b) {
        if (this.length == 3) return this[0] * b[0] + this[1] * b[1] + this[2] * b[2];
        if (this.length == 4) return this[0] * b[0] + this[1] * b[1] + this[2] * b[2] + this[3] * b[3];
        if (this.length > 4) return this.reduce((acc, x, i) => {
            return acc + x * b[i];
        }, 0);
        // Assume a minimum length of 2.
        return this[0] * b[0] + this[1] * b[1];
    }
    // For avoiding repeatedly typing Vec.of in lists.
    static cast(...args) {
        return args.map(x => Vec.from(x));
    }
    to3() {
        return Vec.of(this[0], this[1] || 0, this[2] || 0);
    }
    to4(isPoint) {
        return Vec.of(this[0], this[1] || 0, this[2] || 0, +isPoint);
    }
    cross(b) {
        return Vec.of(this[1] * b[2] - this[2] * b[1], this[2] * b[0] - this[0] * b[2], this[0] * b[1] - this[1] * b[0]);
    }
    to_string() {
        return "[vec " + this.join(", ") + "]"
    }
    toString() {
        return this.to_string();
    }
}

class Mat extends Array {
    constructor(...args) {
        super(0);
        this.push(...args)
    }
    set_identity(m, n) {
        this.length = 0;
        for (let i = 0; i < m; i++) {
            this.push(Array(n).fill(0));
            if (i < n) this[i][i] = 1;
        }
    }
    static identity(size) {
        let data = [];
        for (let i = 0; i < size; ++i) {
            let d = Array(size).fill(0);
            d[i] = 1;
            data.push(d);
        }
        return Mat.of.apply(Mat, data);
    }
    sub_block(start, end) {
        return Mat.from(this.slice(start[0], end[0]).map(r => r.slice(start[1], end[1])));
    }
    column(index) {
        return Vec.from(this.map((r) => r[index]));
    }
    copy() {
        return this.map(r => Vec.of(...r))
    }
    equals(b) {
        return this.every((r, i) => r.every((x, j) => x == b[i][j]))
    }
    plus(b) {
        return this.map((r, i) => r.map((x, j) => x + b[i][j]))
    }
    minus(b) {
        return this.map((r, i) => r.map((x, j) => x - b[i][j]))
    }
    transposed() {
        return this.map((r, i) => r.map((x, j) => this[j][i]))
    }
    times(b) {
        // Mat * scalar case.
        const len = b.length;
        if (typeof len === "undefined")
            return this.map(r => r.map(x => b * x));
        
        // Mat * Vec case.
        const len2 = b[0].length;
        if (typeof len2 === "undefined") {
            let result = new Vec(this.length);
            for (let r = 0; r < len; r++) result[r] = b.dot(this[r]);
            return result;
        }
        
        // Mat * Mat case.
        let result = Mat.from(new Array(this.length));
        for (let r = 0; r < this.length; r++) {
            result[r] = new Array(len2);
            for (let c = 0, sum = 0; c < len2; c++) {
                result[r][c] = 0;
                for (let r2 = 0; r2 < len; r2++)
                    result[r][c] += this[r][r2] * b[r2][c];
            }
        }
        return result;
    }
    pre_multiply(b) {
        const new_value = b.times(this);
        this.length = 0;
        this.push(...new_value);
        return this;
    }
    post_multiply(b) {
        const new_value = this.times(b);
        this.length = 0;
        this.push(...new_value);
        return this;
    }
    static flatten_2D_to_1D(M) {
        let index = 0,
            floats = new Float32Array(M.length && M.length * M[0].length);
        for (let i = 0; i < M.length; i++)
            for (let j = 0; j < M[i].length; j++) floats[index++] = M[i][j];
        return floats;
    }
    to_string() {
        return "[" + this.map((r, i) => "[" + r.join(", ") + "]").join(" ") + "]"
    }
}

class Mat2 extends Mat {
    static inverse(m) {
        const det = m[0][0] * m[1][1] - m[0][1] * m[1][0];

        let ret = Mat.identity(2);
        ret[0][0] = m[1][1] / det;
        ret[0][1] = -m[0][1] / det;
        ret[1][0] = -m[1][0] / det;
        ret[1][1] = m[0][0] / det;
        return ret;
    }
}

class Mat3 extends Mat {
    static inverse(m) {
        const det = m[0][0] * (m[1][1] * m[2][2] - m[2][1] * m[1][2]) -
             m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
             m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);

        let ret = Mat.identity(3);
        ret[0][0] = (m[1][1] * m[2][2] - m[2][1] * m[1][2]) / det;
        ret[0][1] = (m[0][2] * m[2][1] - m[0][1] * m[2][2]) / det;
        ret[0][2] = (m[0][1] * m[1][2] - m[0][2] * m[1][1]) / det;
        ret[1][0] = (m[1][2] * m[2][0] - m[1][0] * m[2][2]) / det;
        ret[1][1] = (m[0][0] * m[2][2] - m[0][2] * m[2][0]) / det;
        ret[1][2] = (m[1][0] * m[0][2] - m[0][0] * m[1][2]) / det;
        ret[2][0] = (m[1][0] * m[2][1] - m[2][0] * m[1][1]) / det;
        ret[2][1] = (m[2][0] * m[0][1] - m[0][0] * m[2][1]) / det;
        ret[2][2] = (m[0][0] * m[1][1] - m[1][0] * m[0][1]) / det;

        return ret;
    }
}

// Generate special 4x4 matrices that are useful for graphics.
class Mat4 extends Mat {
    static identity() {
        return Mat.of([1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]);
    };
    // Requires a scalar (angle) and a 3x1 Vec (axis)
    static rotation(angle, axis) {
            let [x, y, z] = axis.normalized(), [c, s] = [Math.cos(angle), Math.sin(angle)], omc = 1.0 - c;
            return Mat.of(
                [x * x * omc + c,     x * y * omc - z * s, x * z * omc + y * s, 0],
                [x * y * omc + z * s, y * y * omc + c,     y * z * omc - x * s, 0],
                [x * z * omc - y * s, y * z * omc + x * s, z * z * omc + c,     0],
                [0, 0, 0, 1]);
    }
    // Requires a 3x1 Vec.
    static scale(s) {
        if (typeof s === "number")
            s = [s, s, s];
        return Mat.of([s[0], 0, 0, 0], [0, s[1], 0, 0], [0, 0, s[2], 0], [0, 0, 0, 1]);
    }
    // Requires a 3x1 Vec.
    static translation(t) {
        return Mat.of([1, 0, 0, t[0]], [0, 1, 0, t[1]], [0, 0, 1, t[2]], [0, 0, 0, 1]);
    }
    // Note:  look_at() assumes the result will be used for a camera and stores its result in inverse space.  You can also use
    // it to point the basis of any *object* towards anything but you must re-invert it first.  Each input must be 3x1 Vec.                         
    static look_at(eye, at, up) {
        let z = at.minus(eye).normalized(),
            x = z.cross(up).normalized(), // Compute vectors along the requested coordinate axes.
            y = x.cross(z).normalized(); // This is the "updated" and orthogonalized local y axis.
        if (!x.every(i => i == i)) // Check for NaN, indicating a degenerate cross product, which
            throw "Two parallel vectors were given"; // happens if eye == at, or if at minus eye is parallel to up.
        z.scale(-1); // Enforce right-handed coordinate system.                                   
        return Mat4.translation([-x.dot(eye), -y.dot(eye), -z.dot(eye)])
            .times(Mat.of(x.to4(0), y.to4(0), z.to4(0), Vec.of(0, 0, 0, 1)));
    }
    // Box-shaped view volume for projection.
    static orthographic(left, right, bottom, top, near, far) {
        return Mat4.scale(Vec.of(1 / (right - left), 1 / (top - bottom), 1 / (far - near)))
            .times(Mat4.translation(Vec.of(-left - right, -top - bottom, -near - far)))
            .times(Mat4.scale(Vec.of(2, 2, -2)));
    }
    // Frustum-shaped view volume for projection.
    static perspective(fov_y, aspect, near, far) {
        const f = 1 / Math.tan(fov_y / 2),
            d = far - near;
        return Mat.of([f / aspect, 0, 0, 0], [0, f, 0, 0], [0, 0, -(near + far) / d, -2 * near * far / d], [0, 0, -1, 0]);
    }
    // Computing a 4x4 inverse is slow because of the amount of steps; call fewer times when possible.
    static inverse(m) {
        const result = Mat4.identity(),
            m00 = m[0][0], m01 = m[0][1], m02 = m[0][2], m03 = m[0][3],
            m10 = m[1][0], m11 = m[1][1], m12 = m[1][2], m13 = m[1][3],
            m20 = m[2][0], m21 = m[2][1], m22 = m[2][2], m23 = m[2][3],
            m30 = m[3][0], m31 = m[3][1], m32 = m[3][2], m33 = m[3][3];
        result[0][0] = m12 * m23 * m31 - m13 * m22 * m31 + m13 * m21 * m32 - m11 * m23 * m32 - m12 * m21 * m33 + m11 * m22 * m33;
        result[0][1] = m03 * m22 * m31 - m02 * m23 * m31 - m03 * m21 * m32 + m01 * m23 * m32 + m02 * m21 * m33 - m01 * m22 * m33;
        result[0][2] = m02 * m13 * m31 - m03 * m12 * m31 + m03 * m11 * m32 - m01 * m13 * m32 - m02 * m11 * m33 + m01 * m12 * m33;
        result[0][3] = m03 * m12 * m21 - m02 * m13 * m21 - m03 * m11 * m22 + m01 * m13 * m22 + m02 * m11 * m23 - m01 * m12 * m23;
        result[1][0] = m13 * m22 * m30 - m12 * m23 * m30 - m13 * m20 * m32 + m10 * m23 * m32 + m12 * m20 * m33 - m10 * m22 * m33;
        result[1][1] = m02 * m23 * m30 - m03 * m22 * m30 + m03 * m20 * m32 - m00 * m23 * m32 - m02 * m20 * m33 + m00 * m22 * m33;
        result[1][2] = m03 * m12 * m30 - m02 * m13 * m30 - m03 * m10 * m32 + m00 * m13 * m32 + m02 * m10 * m33 - m00 * m12 * m33;
        result[1][3] = m02 * m13 * m20 - m03 * m12 * m20 + m03 * m10 * m22 - m00 * m13 * m22 - m02 * m10 * m23 + m00 * m12 * m23;
        result[2][0] = m11 * m23 * m30 - m13 * m21 * m30 + m13 * m20 * m31 - m10 * m23 * m31 - m11 * m20 * m33 + m10 * m21 * m33;
        result[2][1] = m03 * m21 * m30 - m01 * m23 * m30 - m03 * m20 * m31 + m00 * m23 * m31 + m01 * m20 * m33 - m00 * m21 * m33;
        result[2][2] = m01 * m13 * m30 - m03 * m11 * m30 + m03 * m10 * m31 - m00 * m13 * m31 - m01 * m10 * m33 + m00 * m11 * m33;
        result[2][3] = m03 * m11 * m20 - m01 * m13 * m20 - m03 * m10 * m21 + m00 * m13 * m21 + m01 * m10 * m23 - m00 * m11 * m23;
        result[3][0] = m12 * m21 * m30 - m11 * m22 * m30 - m12 * m20 * m31 + m10 * m22 * m31 + m11 * m20 * m32 - m10 * m21 * m32;
        result[3][1] = m01 * m22 * m30 - m02 * m21 * m30 + m02 * m20 * m31 - m00 * m22 * m31 - m01 * m20 * m32 + m00 * m21 * m32;
        result[3][2] = m02 * m11 * m30 - m01 * m12 * m30 - m02 * m10 * m31 + m00 * m12 * m31 + m01 * m10 * m32 - m00 * m11 * m32;
        result[3][3] = m01 * m12 * m20 - m02 * m11 * m20 + m02 * m10 * m21 - m00 * m12 * m21 - m01 * m10 * m22 + m00 * m11 * m22;
        // Divide by determinant and return.
        return result.times(1 / (m00 * result[0][0] + m10 * result[0][1] + m20 * result[0][2] + m30 * result[0][3]));
    }
}
