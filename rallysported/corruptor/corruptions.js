/*
 * 2022 Tarpeeksi Hyvae Soft
 *
 * Software: RallySportED / Corruptor
 * 
 */

export default {
    "Nitro boost": {
        payload: [
            "byte rallye.exe 97482 13"
        ],
        tooltip: "Increase the maximum speed of the player's car.",
        id: "681cc5590ff7",
    },

    "Rocket boost": {
        payload: [
            "byte rallye.exe 97482 18"
        ],
        tooltip: "Increase the maximum speed of the player's car to a ridiculous level.",
        id: "956db4084d1e",
    },

    "RC cars": {
        payload: [
            // Offset 28879 is the start of a routine to scale car meshes. We'll put
            // a RET instruction there to prevent the meshes from being scaled, which
            // leads to the cars being quite small.
            "byte rallye.exe 28879 195",
        ],
        id: "359df72246af",
    },

    "Big cars": {
        payload: [
            // These offsets are scalars in a routine to scale car meshes. We're setting
            // them to a larger-than-default value.
            "byte rallye.exe 28889 42",
            "byte rallye.exe 28943 42",
            "byte rallye.exe 28988 42",
        ],
        id: "b4b10bd71f3b",
    },

    "Invisible cars": {
        payload: [
            // These offsets are scalars in a routine to scale car meshes.
            "byte rallye.exe 28889 0",
            "byte rallye.exe 28943 0",
            "byte rallye.exe 28988 0",

            // Disable dirt kickup.
            "byte rallye.exe 14557 195",
        ],
        id: "79a438e0a7c4",
    },

    "Reduce starting delay": {
        payload: [
            "byte rallye.exe 82253 82",
        ],
        tooltip: "The starting lights at the beginning of a race will go out faster.",
        id: "6cc701e155d4",
    },

    "No dirt kickup": {
        payload: [
            // Offset 14557 is the start of a routine dealing with dirt kickup; we'll
            // just put a RET instruction there to ignore the whole routine.
            "byte rallye.exe 14557 195",
        ],
        tooltip: "Wheels won't produce kickup when driving over non-tarmac terrain.",
        id: "c4af080d98fb",
    },

    "Invulnerable spectators": {
        payload: [
            // Put a RET instruction at the start of a routine that gets called to deal
            // with cars driving over spectators.
            "byte rallye.exe 16134 195",
        ],
        tooltip: "Spectators won't fall down or scream when run over.",
        id: "a6f3156e0334",
    },

    "No spectator screams": {
        payload: [
            // Use NOP instructions to blank out a call to a routine that plays a scream
            // sound when a spectator is run over.
            "byte rallye.exe 16153 144",
            "byte rallye.exe 16154 144",
            "byte rallye.exe 16155 144",
        ],
        tooltip: "Spectators won't scream when run over.",
        id: "28cc36f6060c",
    },

    "No spectator animations": {
        payload: [
            "byte rallye.exe 18944 235",
        ],
        tooltip: "Spectators will stand still.",
        id: "4ba57208440c",
    },

    "Hovering cars": {
        payload: [
            // Move the car up into the air.
            "byte rallye.exe 15507 150",

            // Disable slowing the car on non-road terrain, like grass (water will still slow it though).
            "byte rallye.exe 16549 235",

            // Disable wheel dirt kickup.
            "byte rallye.exe 14557 195",
        ],
        tooltip: "Cars will hover above ground.",
        id: "d5fe96ef8ce5",
    },

    "Low-resolution ground textures": {
        payload: [
            "byte rallye.exe 98228 6",
        ],
        id: "ab94a4787afd",
    },

    "Solid-colored ground textures": {
        payload: [
            "byte rallye.exe 98228 0",
        ],
        id: "67ab7e0266c7",
    },

    "Small opponent": {
        payload: [
            // Disable a call to a car-resizing routine for the CPU opponent's car mesh.
            "byte rallye.exe 1341 144",
            "byte rallye.exe 1342 144",
            "byte rallye.exe 1343 144",
        ],
        tooltip: "The CPU opponent will drive a small car.",
        id: "be6e731d9d42",
    },

    "Gravity: Low": {
        payload: [
            "byte rallye.exe 14183 10",
        ],
        tooltip: "Very low gravity.",
        id: "bd99af5f3c83",
    },

    "Gravity: High": {
        payload: [
            "byte rallye.exe 14184 0",
        ],
        tooltip: "Very high gravity.",
        id: "cedb3f3ae872",
    },

    "No ground fog": {
        payload: [
            "byte rallye.exe 18314 0",
        ],
        id: "e12a349f32e8",
    },

    "Low camera angle": {
        payload: [
            "byte rallye.exe 98061 255",
            "byte rallye.exe 98062 1",

            // Reduce the Y extent of screen repaint, since the bottom of the screen
            // just contains garbage pixels.
            "byte rallye.exe 17836 53",
        ],
        id: "d31072931f2d",
    },

    "High camera angle": {
        payload: [
            "byte rallye.exe 98061 255",
        ],
        id: "3f613c76248d",
    },

    "Dark ground shadows": {
        payload: [
            "byte rallye.exe 84957 0",
            "byte rallye.exe 84958 0",
        ],
        id: "c8e1b67b4d48",
    },

    "Levitate after jumping": {
        payload: [
            "byte rallye.exe 13056 255",
        ],
        tooltip: "The car will levitate after a jump.",
        id: "a4c4ce0989f4",
    },

    "Flipping car": {
        payload: [
            "byte rallye.exe 14153 50",
        ],
        tooltip: "Allows the car to do 360-degree flips without breaking.",
        id: "c3fb1d415b45",
    },

    "Aqualung": {
        payload: [
            "byte rallye.exe 16427 144",
            "byte rallye.exe 16428 144",
            "byte rallye.exe 16429 144",
            "byte rallye.exe 16430 144",
        ],
        tooltip: "Allows the car to drive underwater indefinitely without breaking.",
        id: "d4d7ea664281",
    },

    "Slo-mo": {
        payload: [
            "byte rallye.exe 1612 255",
        ],
        tooltip: "Slows down game time.",
        id: "b83890bed10d",
    },

    "No car shadows": {
        payload: [
            // Player's car (we blank out a call to a shadow-drawing routine).
            "byte rallye.exe 1810 144",
            "byte rallye.exe 1811 144",
            "byte rallye.exe 1812 144",

            // CPU's car.
            "byte rallye.exe 5195 144",
            "byte rallye.exe 5196 144",
            "byte rallye.exe 5197 144",
        ],
        id: "01348d8f5152",
    },

    "No ground shading": {
        payload: [
            "byte rallye.exe 27874 255",
        ],
        id: "45c0df9aa79c",
    },

    "Dark screen": {
        payload: [
            "byte rallye.exe 17761 54",
        ],
        id: "a4e4e4c2d1af",
    },

    "No lap time display": {
        payload: [
            "byte rallye.exe 8890 195",
        ],
        id: "aa7fe7a206ff",
    },

    "Permanent checkered flag": {
        payload: [
            // Bypass checks for whether the race is over.
            "byte rallye.exe 15115 235",
            "byte rallye.exe 15158 235",
        ],
        tooltip: "The checkered flag will wave on the screen all the time.",
        id: "2fc0f0d957df",
    },

    "PC beeper sounds": {
        payload: [
            // Alter the offset for loading sound data from.
            "byte rallye.exe 631 0",
        ],
        id: "440cc9da66b7",
    },

    "Strange landscapes": {
        payload: [
            // Alter the offset for loading texture data from.
            "byte rallye.exe 621 5",
        ],
        id: "87a1c5d8957b",
    },

    "Kraftwerk car sounds": {
        payload: [
            // Player's car.
            "byte rallye.exe 31972 5",
        ],
        id: "8bcc6bde21fb",
    },

    "Retro tint": {
        payload: [
            "byte rallye.exe 17793 144",
            "byte rallye.exe 17794 144",
        ],
        tooltip: "The screen's colors will take on a retro vibe.",
        id: "8b622ce0d334",
    },

    "Fat cars": {
        payload: [
            "byte rallye.exe 28902 2",
            "byte rallye.exe 28954 2",
            "byte rallye.exe 28999 2",
        ],
        id: "4f257c0d8f3e",
    },

    "Thin cars": {
        payload: [
            "byte rallye.exe 28902 5",
            "byte rallye.exe 28954 5",
            "byte rallye.exe 28999 5",
        ],
        id: "44c009d9425e",
    },

    "Paper cutout cars": {
        payload: [
            "byte rallye.exe 28902 50",
            "byte rallye.exe 28954 50",
            "byte rallye.exe 28999 50",
        ],
        id: "f8b5b4dfb5f5",
    },

    "Tall cars": {
        payload: [
            "byte rallye.exe 28912 2",
            "byte rallye.exe 28964 2",
            "byte rallye.exe 28964 2",
        ],
        id: "f3597cb9a42f",
    },

    "Everything is grass": {
        payload: [
            // The original code moves the proper ground texture id into AL. Instead,
            // we'll populate AL with a fixed texture id value.
            "byte rallye.exe 18284 176",
            "byte rallye.exe 18285 1",
            "byte rallye.exe 18286 144",
        ],
        tooltip: "All ground tiles will be rendered with the grass texture.",
        id: "df11350e8fb2",
    },

    "Everything is a void": {
        payload: [
            "byte rallye.exe 18284 176",
            "byte rallye.exe 18285 255",
            "byte rallye.exe 18286 144",
        ],
        tooltip: "All ground tiles will be rendered with a void texture. Game crashes can be expected.",
        id: "b1cfdba6489e",
    },

    "Winter palette": {
        payload: [
            // Apply to RALLYE.EXE the winter palette stored in PWINTER.EXE (see https://github.com/leikareipa/rallysported-setpal).
            "pwinter p 0",
        ],
        id: "761ea0e47d10",
    },

    "Monochrome palette": {
        payload: [
            // Apply to RALLYE.EXE the monochrome palette stored in PMONO.EXE (see https://github.com/leikareipa/rallysported-setpal).
            "pmono p 0",
        ],
        id: "50c03016f341",
    },

    "Hide 3D objects": {
        payload: [
            "byte rallye.exe 21781 0",
        ],
        id: "343041b25c1e",
    },

    "No damage indicator": {
        payload: [
            "byte rallye.exe 10055 0",
            "byte rallye.exe 10056 0",
            "byte rallye.exe 10057 0",
            "byte rallye.exe 10058 0",
        ],
        tooltip: "Normally, when a car hits a 3D object, a white rectangle is drawn in the top left corner. This disables it.",
        id: "50e6cdea91e8",
    },

    "Collision screams and laughs": {
        payload: [
            "byte rallye.exe 32508 5",
        ],
        tooltip: "Colliding the car with anything has a chance of producing screams or laughs.",
        id: "12fbef33ab4e",
    },

    "Black metal sounds": {
        payload: [
            "byte rallye.exe 31965 10",
        ],
        tooltip: "Harsh audio.",
        id: "459ec4761636",
    },

    "Flashbacks (epilepsy warning)": {
        payload: [
            "byte rallye.exe 12193 17",
        ],
        tooltip: "Cars will teleport around unpredictably. Warning: may cause the screen to flash.",
        id: "f374c97e05bc",
    },

    "Confusion (epilepsy warning)": {
        payload: [
            "byte rallye.exe 12193 15",
        ],
        tooltip: "You won't quite know what's going on. Warning: may cause the screen to flash.",
        id: "4373933b4037",
    },

    "Bumper cars": {
        payload: [
            // Convert SAR EAX,2 to SAL EAX,1.
            "byte rallye.exe 12422 224",
            "byte rallye.exe 12423 1",
        ],
        tooltip: "Aggressive collisions between cars.",
        id: "c68d292a993a",
    },

    "No car-on-car collisions": {
        payload: [
            // Force a RET instruction to the beginning of a car collision handling routine.
            "byte rallye.exe 9373 195",
        ],
        tooltip: "The player and CPU cars can pass through one another.",
        id: "c7d29c738b7c",
    },

    "Laughing engine": {
        payload: [
            // Replace "sound1.wav" with "haha1.wav\0" as the source of the player's engine sound.
            "byte rallye.exe 133123 104",
            "byte rallye.exe 133124 97",
            "byte rallye.exe 133125 104",
            "byte rallye.exe 133126 97",
            "byte rallye.exe 133127 49",
            "byte rallye.exe 133128 46",
            "byte rallye.exe 133129 119",
            "byte rallye.exe 133130 97",
            "byte rallye.exe 133131 118",
            "byte rallye.exe 133132 0",
        ],
        tooltip: "The sound of the player's car engine will be replaced with that of a laughing spectator.",
        id: "f244d40c4ca7",
    },

    "Windy": {
        payload: [
            "byte rallye.exe 12640 144",
            "byte rallye.exe 12641 144",
            "byte rallye.exe 12642 144",
            "byte rallye.exe 12643 144",
        ],
        tooltip: "The car's handling will be affected by windy conditions.",
        id: "58c3e2c5ca3d",
    },

    "Sparse dirt kickup": {
        payload: [
            "byte rallye.exe 14707 2",
        ],
        tooltip: "The car's wheels will kick up dirt only sporadically.",
        id: "43fd9c0c48a5",
    },

    "Replace dirt texture with water": {
        payload: [
            "byte rallye.exe 23068 15",
        ],
        id: "5c13899450f8",
    },

    "Zoomed-in camera": {
        payload: [
            "byte rallye.exe 98277 0",
            "byte rallye.exe 98278 3",
        ],
        id: "ab7a8d3b25e8",
    },

    "Zoomed-out camera": {
        payload: [
            "byte rallye.exe 98277 0",
            "byte rallye.exe 98278 2",
        ],
        id: "1fa88c4eef30",
    },

    "Don't render partial ground tiles": {
        payload: [
            "byte rallye.exe 23559 179",
            "byte rallye.exe 23560 0",
            "byte rallye.exe 23561 144",
            "byte rallye.exe 23562 144",
        ],
        tooltip: "Ground tiles that're partially outside of the screen will be prevented from rendering at all.",
        id: "3775de629239",
    },

    "Flowery path": {
        payload: [
            "byte rallye.exe 23063 38",
            "byte rallye.exe 23066 37",
            "byte rallye.exe 23067 0",
            "byte rallye.exe 23068 1",
            "byte rallye.exe 23069 117",
            "byte rallye.exe 23070 2",
            "byte rallye.exe 23071 180",
            "byte rallye.exe 23072 3",
            "byte rallye.exe 23073 144",
        ],
        tooltip: "Road tiles will be replaced with flowery grass tiles.",
        id: "d30f00aae598",
    },

    "Enthusiastic spectators": {
        payload: [
            "byte rallye.exe 19001 0",
        ],
        tooltip: "Spectators will flap their arms wildly.",
        id: "c1860e01c11d",
    },

    "Disappearing spectators": {
        payload: [
            "byte rallye.exe 18988 209",
            "byte rallye.exe 18989 232",
        ],
        tooltip: "Spectators will disappear when approached.",
        id: "0230b8c75e09",
    },

    "Invisible spectators": {
        payload: [
            "byte rallye.exe 18339 255",
        ],
        id: "4d99ee202f1e",
    },

    "Moving spectators": {
        payload: [
            "byte rallye.exe 18741 6",
        ],
        tooltip: "Spectators will move around as you drive.",
        id: "918b826ca005",
    },

    "Solid-colored 3D object textures": {
        payload: [
            "byte rallye.exe 22296 0",
            "byte rallye.exe 22286 0",
        ],
        id: "ba89a2514ee1",
    },
}
