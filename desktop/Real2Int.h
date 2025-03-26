//
// Real2Int.h
// ** Sree's Real2Int **
// Fast float to int conversion.
//
// "One of the best general conversion
// utilities I have is one that Sree Kotay wrote. It's only safe to use when
// your FPU is in double-precision mode, so you have to be careful about it if
// you're switching precision. It'll basically return '0' all the time if you're
// in single precision."
//
// So make sure you've got the right precision.
// To change it to double-precision (default), use _controlfp( _CW_DEFAULT, 0xfffff );
// and include cfloat. Only works on VC++.

#ifndef REAL2INT_H_
#define REAL2INT_H_

typedef double lreal;
typedef float  real;
typedef unsigned long uint32;
typedef long int32;

const lreal _double2fixmagic = 68719476736.0*1.5;     //2^36 * 1.5,  (52-_shiftamt=36) uses limited precisicion to floor
const int32 _shiftamt        = 16;                    //16.16 fixed point representation,

#if BigEndian_
#define iexp_ 0
#define iman_ 1
#else
#define iexp_ 1
#define iman_ 0
#endif //BigEndian_

int32 Real2Int(real val);

// ================================================================================================
// Real2Int
// ================================================================================================
inline int32 Real2Int(lreal val)
{
	#if DEFAULT_CONVERSION
	return val;
	#else
	val= val + _double2fixmagic;
	return ((int32*)&val)[iman_] >> _shiftamt;
	#endif
}

// ================================================================================================
// Real2Int
// ================================================================================================
inline int32 Real2Int(real val)
{
	#if DEFAULT_CONVERSION
	return val;
	#else
	return Real2Int ((lreal)val);
	#endif
}

#endif	// !def REAL2INT_H_