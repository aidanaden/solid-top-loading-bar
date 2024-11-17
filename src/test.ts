let width = 7;

function iterate() {
  const limit = 0.8 - width / 80;
  let num = limit;
  // Current width has overshot, stop incrementing width
  // By default, this happens once width = 64% (64/80 = 0.8)
  if (limit < 0) {
    num = 0;
  }
  const random = num;
  width = width + random;
}

let i = 0;
while (true) {
  iterate();
  i++;
  console.log({ i: i + 1, width });
  if (Math.ceil(width) === 64) {
    break;
  }
}
