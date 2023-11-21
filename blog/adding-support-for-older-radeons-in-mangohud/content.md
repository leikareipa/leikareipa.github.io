<post-date date="11 February 2023"/>

# Adding support for older Radeons in MangoHud

<div class="note">
    An updated version of this post <a href="/blog/adding-workaround-support-for-unsupported-gpus-in-mangohud/">is available</a>.
</div>

[MangoHud](https://github.com/flightlessmango/MangoHud/) is an on-screen display for Vulkan and OpenGL under Linux. You'd use it in games etc. to display run-time statistics like frame rate and hardware temperature.

Unfortunately, MangoHud [doesn't support pre-amdgpu Radeon GPUs](https://github.com/flightlessmango/MangoHud/issues/233). For example, my decade-old Radeon HD 7970 just about qualifies for amdgpu and generally works with MangoHud, but my slightly older Radeon HD 5770 that falls back on the [radeon](https://linux.die.net/man/4/radeon) driver shows nothing in MangoHud.

Luckily, the seemingly unsupported Radeons' statistics are available on the system through other means, and MangoHud can easily be modified to display them.

With the HD 5770, I used [radeontop](https://github.com/clbr/radeontop) to access the card's run-time performance metrics. Since MangoHud reads Radeon statistics from the file system (**/sys/class/drm/.../**), I passed radeontop's outpt via stdout <span style="white-space: nowrap;">(*$ radeontop -d -*)</span> into a simple program I wrote to parse and save the data to disk in the format that MangoHud expects.

I then patched MangoHud's [overlay.cpp:760](https://github.com/flightlessmango/MangoHud/blob/v0.6.8/src/overlay.cpp#L760) to allow overriding the default statistics file locations:

```c++ [{headerless}]
for (const auto &override: std::unordered_map<std::string, FILE**>{
    {"gpu_busy_percent", &amdgpu.busy},
    {"mem_info_vram_total", &amdgpu.vram_total},
    {"mem_info_vram_used", &amdgpu.vram_used},
    {"mem_info_gtt_used", &amdgpu.gtt_used},
    {"temp1_input", &amdgpu.temp},
    {"freq1_input", &amdgpu.core_clock},
    {"freq2_input", &amdgpu.memory_clock},
    {"power1_average", &amdgpu.power_usage},
}){
    FILE *const f = fopen((std::string(getenv("HOME")) + "/.mangohud_override/" + override.first).c_str(), "r");
    if (f) {
        *override.second = f;
    }
}
```

With the patch, if MangoHud finds a particular statistic file under **~/.mangohud_override/**, it'll read from it and ignore the usual location. A nicer way to implement this would be to allow the path to be set via MangoHud's config file, but good enough.

Statistics for the old HD 5770 are then available in MangoHud:

![{youtube}{headerless}](vfqxiOpDCmg)

I did find that there's a bug either in the radeon driver or the Linux kernel that causes the amount of VRAM to be misreported when it's close to saturation &ndash; the value overflows to a massive number. The problem doesn't seem specific to radeontop, as CoreCtrl also reports it.