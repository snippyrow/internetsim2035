function shuffleDivItems(divId) {
    // Get the div element by its ID
    let container = document.getElementById(divId);
    
    // Get all child elements inside the div
    let items = Array.from(container.children);
    
    // Shuffle the items array using the Fisher-Yates algorithm
    for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];  // Swap elements
    }

    // Re-attach the shuffled items back into the container
    items.forEach(item => container.appendChild(item));
}

var IntId;

function failed() {
    clearInterval(IntId);
    alert("You failed the test");
    // Refresh the page
    location.reload();
}
var xp = 0;
var yp = 50;
var xd = 1;
var yd = 1;
var sped = 5;

var difficulty = 30;

function randf() {
    return 0.5 + (Math.random() / 2);
}

function startpong() {
    var t = 5;
    var cnt_id = setInterval(function() {
        document.getElementById("hint").innerHTML = `Confirm you want to continue within ${t.toFixed(1)} seconds.`
        t = t - 1/60

        if (t <= 0) {
            failed();
        }

        document.getElementById("confirm-ball").style.transform = `translate(${xp}px, ${yp}px)`;
        var desc = document.getElementById("pong-root").getElementsByTagName('div');
        for (i = 0; i < desc.length; ++i) {
            let e = desc[i];
            e.style.transform = `translate(${-15 + (i * 515)}px, ${yp}px)`;
        }
        
        console.log(xp)
        xp = xp + xd  * sped;
        yp = yp + yd  * sped;
        if (xp >= 500 - 40) {
            xd = -randf();
        } else if (xp < 0) {
            xd = randf();
        }

        if (yp >= 500 - 40) {
            yd = -randf();
        } else if (yp < 0) {
            yd = randf();
        }
    },(1/60) * 1000)
    IntId = cnt_id;
}

function next() {
    clearInterval(IntId);
    // destroy the picker window for first stage
    document.getElementById("picker-grid-1").remove()
    document.getElementById("pong-root").style.display = "block"
    startpong();
}

function winner() {
    alert("You passed, proceed")
    window.location.replace("page.html")
}

var ads = Array();
var rf = 0;
var num = 0;

async function adService() {
    setInterval(function() {
        rf++;
        // loop over all ads
        var desc = document.getElementById("adcontent").getElementsByTagName('div');
        for (i = 0; i < desc.length; ++i) {
            let e = desc[i];
            const { m41: x, m42: y } = new DOMMatrix(getComputedStyle(e).transform);

            px = x + 10 * parseFloat(e.getAttribute("dx"));
            py = y + 7 * parseFloat(e.getAttribute("dy"));
            if (px >= window.screen.width) {
                e.setAttribute("dx",-randf());
            } else if (px < 0) {
                e.setAttribute("dx",randf());
            }

            if (py >= window.screen.height) {
                e.setAttribute("dy",-randf());
            } else if (py < 0) {
                e.setAttribute("dy",randf());
            }
            e.style.transform = `translate(${px}px, ${py}px)`;
        }

        // check if new
        if (rf % difficulty == 0) {
            num++;
            var node = document.getElementById("adtemplate");
            var clone = node.cloneNode(true);
            clone.style.display = "block";
            clone.style.transform = `translate(${Math.random()*window.innerWidth}px, ${Math.random()*window.innerHeight}px)`;
            //clone.getElementsByTagName("")
            document.getElementById("adcontent").appendChild(clone);
            document.getElementById("adcnt").innerHTML = `${num} ads spawned`;
        }
    },(1/60) * 1000);
}

window.addEventListener('load', function () {
    const slider = document.getElementById("slider");
    slider.addEventListener("input", function() {
        difficulty = 100-parseInt(slider.value);
    });
    document.getElementById("start").addEventListener('click',function() {
        console.log("E")
        document.getElementById("landing").style.opacity = "0";
        document.getElementById("captcha-root").style = "opacity: 1; display: box;";
        //document.getElementById("captcha-root").style.opacity = "1";
        var t = 5;
        var total = 0;
        shuffleDivItems("picker-grid-1");
        // Loop through the div and add listeners to each cell
        var desc = document.getElementById("picker-grid-1").getElementsByTagName('*');
        for (i = 0; i < desc.length; ++i) {
            let e = desc[i];
            console.log(e)
            e.addEventListener('click',function() {
                if (e.getAttribute('real') === "true") {
                    e.style.backgroundColor = "green";
                    e.setAttribute('real',"none");
                    total += 1;
                    if (total >= 3) {
                        next();
                    }
                } else if (e.getAttribute('real') === "false") {
                    failed();
                } else {

                }
            });
        }
        
        
        var cnt_id = setInterval(function() {
            document.getElementById("hint").innerHTML = `Select all real math in ${t.toFixed(1)} seconds.`
            t = t - 0.1
            if (t <= 0) {
                failed();
            }
        },100)
        IntId = cnt_id;

        document.getElementById("confirm-ball").addEventListener('click',function() {
            document.getElementById("pong-root").remove()
            document.getElementById("binary-root").style.display = "block"
            clearInterval(IntId);

            var inp = document.getElementById("bin-input")
            inp.addEventListener('keypress', function (event) {
                if (event.keyCode === 13) {
                    if (inp.value == "scrapyarding a captcha!!") {
                        alert("success")
                        winner();
                    } else {
                        failed();
                    }
                }
            });
            t = 10;
            var cnt_id = setInterval(function() {
                document.getElementById("hint").innerHTML = `You have ${t.toFixed(1)} seconds remaining.`
                t = t - 0.1
                if (t <= 0) {
                    failed();
                }
            },100)
            IntId = cnt_id;
        });
    })

    document.addEventListener("click", function(event) {
        const x = event.clientX;
        const y = event.clientY;

        // loop though all ads and launch away
        var desc = document.getElementById("adcontent").getElementsByTagName('div');
        for (i = 0; i < desc.length; ++i) {
            let e = desc[i];
            const { m41: adx, m42: ady } = new DOMMatrix(getComputedStyle(e).transform);

            // normalize to origin
            px = adx - x;
            py = ady - y;

            let a = Math.atan2(py, px);
            
            e.setAttribute("dx",-Math.cos(a));
            e.setAttribute("dy",-Math.sin(a));
        }
    
        console.log(`Clicked at X: ${x}, Y: ${y}`);
    });
})

// Play fan
document.addEventListener("touchstart", playAudio, { once: true });
document.addEventListener("click", playAudio, { once: true });
function playAudio() {
    var audio = new Audio('Assets/fan.mp3');
    audio.play().catch(error => console.log("Audio play failed:", error));
    adService();
}
