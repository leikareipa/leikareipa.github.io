<post-date date="21 February 2023"/>

# Adding workaround support for unsupported GPUs in MangoHud

In [a previous blog post](/blog/adding-support-for-older-radeons-in-mangohud/), I went over the steps required to add support for older Radeons in MangoHud. But those steps are specific to AMD GPUs &ndash; what if you have an unsupported non-AMD GPU, like Intel's integrated graphics?

In this post, I'll again describe a patch to MangoHud that implements an override folder into which you can stream GPU statistics using some third-party method &ndash; e.g. via [intel_gpu_top](https://manpages.ubuntu.com/manpages/jammy/man1/intel_gpu_top.1.html) in the case of Intel graphics &ndash; for MangoHud to read and display. It's quite similar to the patch I described in the previous post, but this time not limited to AMD GPUs, and appended with a few other improvements as well.

## The patch

The patch modifies two of MangoHud's source files, [overlay.cpp](https://github.com/flightlessmango/MangoHud/blob/v0.6.8/src/overlay.cpp) and [gpu.cpp](https://github.com/flightlessmango/MangoHud/blob/v0.6.8/src/gpu.cpp). The modifications are discussed below. Pay attention to the code snippets' line numbers, as they indicate where in the source file the code is inserted.

The gist of the modifications is that they allow the user to feed in custom GPU statistics via the file system.

### overlay.cpp

For convenience, we'll establish a global boolean to indicate whether the user has provided custom input:

```c++ [{headerless}{line-num-starts-at:39}]
bool forceCustomInput = false;
```

If custom input is provided, we'll force MangoHud's GPU state polling down the AMD GPU path:

```c++ [{headerless}{line-num-starts-at:131}]
// This call should come after all the other stat-fetching calls. The idea is that
// it overrides any stats for which there's a custom input defined, regardless of
// whether the GPU is AMD (we just use the AMD code path for convenience).
if (forceCustomInput)
    getAmdGpuInfo();
```

Finally, this code actually determines whether the user has provided custom input, and makes MangoHud aware of it:

```c++ [{headerless}{line-num-starts-at:769}]
// Provide a folder via which the user can override GPU statistics. Note that
// we're using the AMD GPU code path, but it's just for our convenience and
// the implementation works (or should work) with non-AMD GPUs as well.
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
    FILE *const f = fopen((std::string(getenv("HOME")) + "/.mangohud_input/" + override.first).c_str(), "r");
    if (f) {
        *override.second = f;
        forceCustomInput = true;
        params.enabled[OVERLAY_PARAM_ENABLED_gpu_stats] = true;
    }
}
```

Since MangoHud reads AMD GPU statistics from the file system (via *getAmdGpuInfo()*), we've repurposed the mechanism to allow the user to inject custom statistics files via the **~/.mangohud_input/** directory. For any such file found, the modified MangoHud will replace the statistic's usual value with the value from the custom file.

For example, creating the file **~/.mangohud_input/gpu_busy_percent** and placing the value 11 in it, MangoHud's GPU usage indicator will show "11" while the rest of the GPU stats will be displayed as per usual. Modifying the file's value will be reflected in MangoHud's display.

### gpu.cpp

A small modification is needed in [gpu.cpp:76](https://github.com/flightlessmango/MangoHud/blob/v0.6.8/src/gpu.cpp#L76):

<x-diff>
    - if (metrics_path.empty()){\
    + {
</x-diff>

This allows us to call *getAmdGpuInfo()* a second time to fetch custom input. As far as I can see, regardless of what *metrics_path.empty()* evaluates to, the conditional block includes pointer checks that will evaluate the same way, so the first time we call *getAmdGpuInfo()* the conditional is unnecessary, and the second time it could prevent custom input from registering.

## Notes

The patch proposed here is a bit of a kludge and not intended as a permanent feature. It attempts to minimize the amount of code needed to be modified or added, while still delivering the intended functionality.

I've tested the patch lightly, using AMD and Intel hardware. There are likely some issues and corner cases lurking around.
