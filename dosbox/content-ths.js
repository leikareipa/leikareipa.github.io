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
    "^/?rally-sport/rs/?$": {
        title: "Rally-Sport (RS)",
        zip: "./content/rally-sport/rs/rallys.zip",
        persist: "/rs-mutat",
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

    undefined: {
        zip: "",
    }
};
