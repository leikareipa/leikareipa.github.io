/*
 * Most recent known filename: js/matrix44.js
 *
 * Tarpeeksi Hyvae Soft 2018
 *
 * 4 x 4 matrix manipulation.
 * 
 *      Adapted from code originally written by Benny Bobaganoosh for his 3d software renderer
 *      (https://github.com/BennyQBD/3DSoftwareRenderer). Full attribution:
 *      {
 *          Copyright (c) 2014, Benny Bobaganoosh
 *          All rights reserved.
 *
 *          Redistribution and use in source and binary forms, with or without
 *          modification, are permitted provided that the following conditions are met:
 *
 *          1. Redistributions of source code must retain the above copyright notice, this
 *              list of conditions and the following disclaimer.
 *          2. Redistributions in binary form must reproduce the above copyright notice,
 *              this list of conditions and the following disclaimer in the documentation
 *              and/or other materials provided with the distribution.
 *
 *          THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 *          ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 *          WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 *          DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 *          ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 *          (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 *          LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 *          ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *          (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 *          SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *      }
 *
 */

"use strict"

const matrix44_n = {};
{
    matrix44_n.multiply_matrices = function(m1 = [], m2 = [])
    {
        k_assert(((m1.length === 16) && (m2.length === 16)), "Expected 4 x 4 matrices.");

        let mResult = [];
        for (let i = 0; i < 4; i++)
        {
            for (let j = 0; j < 4; j++)
            {
                mResult[i + (j * 4)] = (m1[i + (0 * 4)] * m2[0 + (j * 4)]) +
                                       (m1[i + (1 * 4)] * m2[1 + (j * 4)]) +
                                       (m1[i + (2 * 4)] * m2[2 + (j * 4)]) +
                                       (m1[i + (3 * 4)] * m2[3 + (j * 4)]);
            }
        }

        k_assert((mResult.length === 16), "Expected a 4 x 4 matrix.");
        return mResult;
    }

    matrix44_n.translation_matrix = function(x = 0.0, y = 0.0, z = 0.0)
    {
        let m = [];
        m[0]=1; m[4]=0; m[ 8]=0; m[12]=x;
        m[1]=0; m[5]=1; m[ 9]=0; m[13]=y;
        m[2]=0; m[6]=0; m[10]=1; m[14]=z;
        m[3]=0; m[7]=0; m[11]=0; m[15]=1;

        k_assert((m.length === 16), "Expected a 4 x 4 matrix.");
        return m;
    }

    matrix44_n.rotation_matrix = function(x = 0.0, y = 0.0, z = 0.0)
    {
        let m1 = [], m2 = [], m3 = [];

        m1[0]=1;           m1[4]=0;            m1[ 8]=0;            m1[12]=0;
        m1[1]=0;           m1[5]=Math.cos(x);  m1[ 9]=-Math.sin(x); m1[13]=0;
        m1[2]=0;           m1[6]=Math.sin(x);  m1[10]=Math.cos(x);  m1[14]=0;
        m1[3]=0;           m1[7]=0;            m1[11]=0;            m1[15]=1;

        m2[0]=Math.cos(y); m2[4]=0;            m2[ 8]=-Math.sin(y); m2[12]=0;
        m2[1]=0;           m2[5]=1;            m2[ 9]=0;            m2[13]=0;
        m2[2]=Math.sin(y); m2[6]=0;            m2[10]=Math.cos(y);  m2[14]=0;
        m2[3]=0;           m2[7]=0;            m2[11]=0;            m2[15]=1;

        m3[0]=Math.cos(z); m3[4]=-Math.sin(z); m3[ 8]=0;            m3[12]=0;
        m3[1]=Math.sin(z); m3[5]=Math.cos(z);  m3[ 9]=0;            m3[13]=0;
        m3[2]=0;           m3[6]=0;            m3[10]=1;            m3[14]=0;
        m3[3]=0;           m3[7]=0;            m3[11]=0;            m3[15]=1;

        const temp = matrix44_n.multiply_matrices(m2, m3);
        const mResult = matrix44_n.multiply_matrices(m1, temp);

        k_assert((mResult.length === 16), "Expected a 4 x 4 matrix.");
        return mResult;
    }

    matrix44_n.perspective_matrix = function(fov = 0.0, aspectRatio = 0.0, zNear = 0, zFar = 0)
    {
        const fovHalf = Math.tan(fov / 2);
        const zRange = (zNear - zFar);
        
        let m = [];
        m[0]=(1 / (fovHalf * aspectRatio)); m[4]=0;             m[ 8]=0;                          m[12]=0;
        m[1]=0;                             m[5]=(1 / fovHalf); m[ 9]=0;                          m[13]=0;
        m[2]=0;                             m[6]=0;             m[10]=((-zNear - zFar) / zRange); m[14]=(2 * zFar * (zNear / zRange));
        m[3]=0;                             m[7]=0;             m[11]=1;                          m[15]=0;

        k_assert((m.length === 16), "Expected a 4 x 4 matrix.");
        return m;
    }

    matrix44_n.screen_space_matrix = function(width = 0, height = 0)
    {
        let m = [];
        m[0]=(width / 2); m[4]=0;             m[ 8]=0; m[12]=(width / 2) - 0.5;
        m[1]=0;           m[5]=-(height / 2); m[ 9]=0; m[13]=(height / 2) - 0.5;
        m[2]=0;           m[6]=0;             m[10]=1; m[14]=0;
        m[3]=0;           m[7]=0;             m[11]=0; m[15]=1;

        k_assert((m.length === 16), "Expected a 4 x 4 matrix.");
        return m;
    }

    matrix44_n.identity_matrix = function()
    {
        let m = [];
        m[0]=1; m[4]=0; m[ 8]=0; m[12]=0;
        m[1]=0; m[5]=1; m[ 9]=0; m[13]=0;
        m[2]=0; m[6]=0; m[10]=1; m[14]=0;
        m[3]=0; m[7]=0; m[11]=0; m[15]=1;

        k_assert((m.length === 16), "Expected a 4 x 4 matrix.");
        return m;
    }
}
