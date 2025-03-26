<post-date date="31 January 2023"/>

# Benefits of upgrading a Ryzen 5600X to a 5900X

Competition between AMD and Intel has been pushing down CPU prices. I hopped on the bandwagon by swapping my Ryzen 5 5600X for a Ryzen 9 5900X.

I'll take a moment in this post to talk about the benefits (and non-benefits) of the upgrade in some of my workflows.

## Single-threaded JS rasterizer

I've previously written a [retro-oriented single-threaded software 3D rasterizer in JavaScript](https://www.github.com/leikareipa/retro-ngon/).

Below are results from [one of its benchmarks](https://leikareipa.github.io/retro-ngon/tests/performance/quake-1.html?scale=0.5) running on the 5900X and the 5600X at a render resolution of 1720 &times; 639 in Google Chrome 109.

<dokki-table headerless>
    <table>
        <tr>
            <th></th>
            <th>Stock</th>
            <th>No boost</th>
            <th>Eco preset</th>
            <th>No boost + Eco preset</th>
        </tr>
        <tr>
            <th>5600X</th>
            <td>50</td>
            <td>41</td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <th>5900X</th>
            <td>52</td>
            <td>41</td>
            <td>52</td>
            <td>41</td>
        </tr>
        <tfoot>
            <tr>
                <td colspan="5">
                    Values are frames per second. Higher is better.
                </td>
            </tr>
        </tfoot>
    </table>
</dokki-table>

The two CPUs are known to be nearly identical in single-core performance, and that's reflected in this single-thread-heavy benchmark.

## Multi-threaded JS path tracer

One of my spare-time projects is a [multi-threaded JavaScript (TypeScript) path tracer](https://www.github.com/leikareipa/wray/). It's simply a vanilla path tracer that renders via Web Workers.

Below are results from [a sample scene](https://leikareipa.github.io/experimental/wray/samples/sample1.html?threads=all&pixelSize=1&resolution=1280x720) running on the 5900X and the 5600X in Google Chrome 109.

<dokki-table headerless>
    <table>
        <tr>
            <th></th>
            <th>Stock</th>
            <th>No boost</th>
            <th>Eco preset</th>
            <th>No boost + Eco preset</th>
        </tr>
        <tr>
            <th>5600X</th>
            <td>540</td>
            <td>510</td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <th>5900X</th>
            <td>600</td>
            <td>600</td>
            <td>610</td>
            <td>610</td>
        </tr>
        <tfoot>
            <tr>
                <td colspan="5">
                    Values are thousands of samples per second. Higher is better.
                </td>
            </tr>
        </tfoot>
    </table>
</dokki-table>

Although technically multi-threaded, the renderer is clearly bottlenecked in its thread scaling, with the 5900X topping out not far ahead of the 5600X despite having twice as many cores.

The renderer also comes with a [performance test](https://leikareipa.github.io/experimental/wray/tests/performance/perftest1.html) that measures raw render throughput without overhead from displaying the rendered image. Below are results from that test running on the 5900X in Google Chrome 109 and using the same scene as above.

<dokki-table headerless>
    <table>
        <tr>
            <th>Threads</th>
            <th>Performance with the 5900X<sup>1</sup></th>
        </tr>
        <tr>
            <td>1</td>
            <td>135</td>
        </tr>
        <tr>
            <td>2</td>
            <td>265</td>
        </tr>
        <tr>
            <td>6</td>
            <td>598</td>
        </tr>
        <tr>
            <td>12</td>
            <td>718</td>
        </tr>
        <tr>
            <td>24</td>
            <td>626</td>
        </tr>
        <tfoot>
            <tr>
                <td colspan="5">
                    Values are thousands of samples per second. Higher is better.
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <sup>1</sup>CPU running in Eco mode with boosting disabled.
                </td>
            </tr>
        </tfoot>
    </table>
</dokki-table>

The effect of the display overhead isn't very big, as the 24-core result here is similar to the (24-core) result in the previous test. But it also does appear that the renderer chokes on the 5900X's thread count, negating the benefit of the 12 weaker SMT threads.

Limiting the renderer to 12 threads on the 5900X to avoid the excessive thread-handling overhead, the CPU's performance gain over the 5600X is still in the 30&ndash;50% range.

## Multi-threaded C++ voxel ray tracer

I've also written a [software voxel ray tracer in C++](https://github.com/leikareipa/vond) that uses OpenMP for multithreading. Below are results from [one of its sample scenes](https://github.com/leikareipa/vond/tree/master/src/samples/simple_landscape) running on the 5900X in 720 &times; 450 resolution.

<dokki-table headerless>
    <table>
        <tr>
            <th>Threads</th>
            <th>FPS with the 5900X<sup>1</sup></th>
        </tr>
        <tr>
            <td>1</td>
            <td>12</td>
        </tr>
        <tr>
            <td>2</td>
            <td>22</td>
        </tr>
        <tr>
            <td>4</td>
            <td>44</td>
        </tr>
        <tr>
            <td>6</td>
            <td>66</td>
        </tr>
        <tr>
            <td>8</td>
            <td>83</td>
        </tr>
        <tr>
            <td>10</td>
            <td>100</td>
        </tr>
        <tr>
            <td>12</td>
            <td>116</td>
        </tr>
        <tr>
            <td>24</td>
            <td>140</td>
        </tr>
        <tfoot>
            <tr>
                <td colspan="2">
                    Values are frames per second. Higher is better.
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <sup>1</sup>CPU running in Eco mode with boosting disabled.
                </td>
            </tr>
        </tfoot>
    </table>
</dokki-table>

Although I didn't run this test on the 5600X, the table shows relatively good performance scaling with extra threads, so it's not unreasonable to assume that the 5900X is nearly twice as fast as the 5600X here.

## Compiling code with GCC

The table below shows compilation times for [one of my C++ projects](https://github.com/leikareipa/vcs) using GCC 9.4.0.

<dokki-table headerless>
    <table>
        <tr>
            <th></th>
            <th>Stock</th>
            <th>No boost</th>
            <th>Eco preset</th>
            <th>No boost + Eco preset</th>
        </tr>
        <tr>
            <th>5600X</th>
            <td>17</td>
            <td>19</td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <th>5900X</th>
            <td>11</td>
            <td>13</td>
            <td>12</td>
            <td>14</td>
        </tr>
        <tfoot>
            <tr>
                <td colspan="5">
                    Values are seconds. Lower is better.
                </td>
            </tr>
        </tfoot>
    </table>
</dokki-table>

The 5900X brings the compile time down by 35%. Even with Eco mode enabled and boosting disabled, it remains 18% faster than the stock 5600X.

## Compiling code with webpack

The table below shows compilation times for [one of my JavaScript projects](https://github.com/leikareipa/dokki) using webpack 5.73.0.

<dokki-table headerless>
    <table>
        <tr>
            <th></th>
            <th>Stock</th>
            <th>No boost</th>
            <th>Eco preset</th>
            <th>No boost + Eco preset</th>
        </tr>
        <tr>
            <th>5600X</th>
            <td>3.2</td>
            <td>3.9</td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <th>5900X</th>
            <td></td>
            <td></td>
            <td>3.1</td>
            <td>3.9</td>
        </tr>
        <tfoot>
            <tr>
                <td colspan="5">
                    Values are seconds. Lower is better.
                </td>
            </tr>
        </tfoot>
    </table>
</dokki-table>

Although I didn't run this test without Eco mode on the 5900X, it's fairly likely that the 5900X overall is not considerably faster than the 5600X with this thinly-threaded workload.

## Video processing

I used FFmpeg to extract a clip from a 1920 &times; 1080 video file and convert it from RGB to YUV color.

<dokki-code headerless inline-class="terminal-command">
    time ffmpeg -i in.mp4 -ss 00:30 -to 00:40 -crf 14 -f null -c:a copy -c:v libx264 -pix_fmt yuv420p -preset faster -vf 'colormatrix=bt601:bt709' -
</dokki-code>

<dokki-table headerless>
    <table>
        <tr>
            <th></th>
            <th>Stock</th>
            <th>No boost</th>
            <th>Eco preset</th>
            <th>No boost + Eco preset</th>
        </tr>
        <tr>
            <th>5600X</th>
            <td>26</td>
            <td>31</td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <th>5900X</th>
            <td>19</td>
            <td>23</td>
            <td>22</td>
            <td>23</td>
        </tr>
        <tfoot>
            <tr>
                <td colspan="5">
                    Values are seconds. Lower is better.
                </td>
            </tr>
        </tfoot>
    </table>
</dokki-table>

I expected the 5900X to beat the 5600X by more than the 27% seen here, but it's an improvement in any case. That said, seeking (*-ss*) is a different process from encoding (and different again if given after *-i* than before it), so it's possible that with a longer clip to encode, the results may have skewed more in favor of the 5900X.

I also ran this test using a single thread. The results showed the 5900X to be almost twice as fast as the 5600X, the former taking about a minute and the latter about two minutes. It's such an extreme difference that I suspect there was a mistake involved. I don't have access to the 5600X any more to verify the result, so take this for what it's worth.

## Gaming in Cyberpunk 2077

Here are results from Cyberpunk 2077's built-in benchmark running in 2560 &times; 1080 resolution with the High graphics preset and a Radeon RX 6600 XT graphics card.

<dokki-table headerless>
    <table>
        <tr>
            <th></th>
            <th>Stock</th>
            <th>No boost</th>
            <th>Eco preset</th>
            <th>No boost + Eco preset</th>
        </tr>
        <tr>
            <th>5600X</th>
            <td>78</td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <th>5900X</th>
            <td>77</td>
            <td></td>
            <td>80</td>
            <td>80</td>
        </tr>
        <tfoot>
            <tr>
                <td colspan="5">
                    Values are frames per second. Higher is better.
                </td>
            </tr>
        </tfoot>
    </table>
</dokki-table>

The two CPUs are known to be fairly similar in gaming performance, and the results with this system speak the same language. The test is hitting against GPU rather than CPU limitations.
 
## Discussion

The tests generally showed single-core performance to be similar between the 5600X and the 5900X, while heavy-threaded applications favored the 5900X &ndash; as to be expected.

For web developers and non-high-end gamers looking for extra performance, the upgrade from the 5600X to the 5900X doesn't seem worth it. C++ developers and the like would stand to benefit from it more, as would those with video processing purposes. For heavily CPU-bound and parallelizable tasks, the upgrade is solid and borders on twice the performance.

One extra benefit of the 5900X over the 5600X is that in multithreaded applications it can provide a comparable level of performance with noticeably lower heat output when its power draw is manually limited.

Given that the 5900X is currently twice as expensive as the 5600X, the latter seems the more sensible choice of the two overall. On the other hand, the 5900X costs about the same now as what the 5600X did just a year or so ago, so it's good value from that perspective. If you're not already invested in the AM4 platform, the Intel Core i5-13600K is also worth a look for multi-core performance comparable to the 5900X but faster single-core.
