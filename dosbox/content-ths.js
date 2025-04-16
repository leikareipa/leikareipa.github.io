/*
 * 2021 Tarpeeksi Hyvae soft.
 *
 */

export default {
    "^/?rally-sport/demo/?$": {
        title: "Rally-Sport (demo)",
        zip: "./content/rally-sport/demo/rallys.zip",
        persist: "/rs-demo",
        run: "rally.bat",
    },
    "^/?rally-sport/rallys/?$": {
        title: "Rally-Sport (demo)",
        zip: "./content/rally-sport/demo/rallys.zip",
        persist: "/rallys",
        scaler: "fillerup",
        run: "?run",
    },
    "^/?geoclock/?$": {
        title: "GeoClock",
        zip: "./content/geoclock/geoclock.zip",
        persist: "/geoclock",
        run: ["cls", "geoclk.exe"],
        scaler: "fillerup",
    },
    "^/?operation-cleaner/?$": {
        title: "Operation Cleaner",
        zip: "./content/operation-cleaner/cleaner.zip",
        persist: "/opclean",
        run: ["cls", "cleaner.exe"],
        scaler: "fillerup",
    },
    "^/?pp/?$": {
        title: "PP",
        zip: "./content/pp/pp.zip",
        persist: "/pp",
        run: ["pp.exe"],
        scaler: "fillerup",
    },
    "^/?quake/sw/?$": {
        title: "Quake (shareware)",
        zip: "./content/quake/shareware/quake.zip",
        persist: "/quake",
        run: ["cls", "quake.exe -nocdaudio"],
        scaler: "fillerup",
    },
    "^/?qbasic/?$": {
        title: "QBasic",
        zip: "./content/qbasic/qb.zip",
        persist: "/qbasic",
        run: ["cls", "keyb su > nul", "cls", "qbasic.exe"],
        scaler: "fillerup",
    },
    "^/?rallysported/corruptor/?$": {
        title: "RallySportED / Corruptor",
        zip: "./content/rally-sport/rs/rallys.zip",
        persist: "/rs-corru",
        run: "?run",
    },
    "^/?dos-path-tracing-benchmark/?$": {
        title: "DOS Path Tracing Benchmark",
        zip: "./content/dos-path-tracing-benchmark/dptb.zip",
        run: ["cls", "pathb.exe"],
    },
    "^/?rallysported/demo/rtex/?$": {
        title: "RallySportED's texture editor",
        zip: "./content/rallysported/demo/rtex-demo.zip",
        run: ["cls", "rtex demod"],
    },
    "^/?dos-c-compiler-benchmark(:|/)mix-power-c-2/?$": {
        title: "DOS C Compiler Benchmark",
        zip: "./content/dos-c-compiler-benchmark/dccb.zip",
        run: ["cls", "t_pc.exe"],
    },
    "^/?dos-c-compiler-benchmark(:|/)microsoft-c-cpp-8/?$": {
        title: "DOS C Compiler Benchmark",
        zip: "./content/dos-c-compiler-benchmark/dccb.zip",
        run: ["cls", "t_vc15.exe"],
    },
    
    "^/?o1-test(:|/)o1-mini/?$": {
        title: "o1-test",
        zip: "./content/o1-test/o1-test.zip",
        run: ["cls", "o1-mini.com"],
    },
    "^/?o1-test(:|/)claude-3-opus/?$": {
        title: "o1-test",
        zip: "./content/o1-test/o1-test.zip",
        run: ["cls", "c3o.com"],
    },
    "^/?ai-asm-bench/claude-4-sonnet/mouse/?$": {
        title: "AI ASM BENCH",
        zip: "./content/ai-asm-bench/claude-4-sonnet.zip",
        run: ["cls", "mouse.com"],
    },
    "^/?ai-asm-bench/claude-4-sonnet/parrot/?$": {
        title: "AI ASM BENCH",
        zip: "./content/ai-asm-bench/claude-4-sonnet.zip",
        run: ["cls", "parrot.com"],
    },
    "^/?ai-asm-bench/gemini-3-pro/plsmcube/?$": {
        title: "AI ASM BENCH",
        zip: "./content/ai-asm-bench/gemini-3-pro.zip",
        run: ["cls", "plsmcube.com"],
    },
    
    "^/?ai-asm-bench/gemini-3-pro-preview/games/?$": {
        title: "AI ASM BENCH",
        zip: "./content/ai-asm-bench/gemini-3-pro-preview-games.zip",
        run: ["cls", "dir *.com"],
    },
    "^/?ai-asm-bench/claude-opus-4-5/games/?$": {
        title: "AI ASM BENCH",
        zip: "./content/ai-asm-bench/claude-opus-4-5-games.zip",
        run: ["cls", "dir *.com"],
    },

    undefined: {
        zip: "",
    }
};
