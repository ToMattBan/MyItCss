const fs = require("fs");

function setDefaults(myItConfigs) {
  let defaultJson = {};

  try {
    defaultJson = fs.readFileSync("./configs/default_myitcss.json", "utf8");
    defaultJson = JSON.parse(defaultJson);

    if (!myItConfigs.settings) myItConfigs.settings = defaultJson.settings;
    else {
      if (!myItConfigs.settings.colors)
        myItConfigs.settings.colors = defaultJson.settings.colors;

      if (!myItConfigs.settings.breakpoints)
        myItConfigs.settings.breakpoints = defaultJson.settings.breakpoints;

      if (!myItConfigs.settings.spacements)
        myItConfigs.settings.spacements = defaultJson.settings.spacements;

      if (!myItConfigs.settings.prefixes)
        myItConfigs.settings.prefixes = defaultJson.settings.prefixes;
    }

    return myItConfigs;
  } catch (err) {
    console.error(err);
    return myItConfigs;
  }
}

function checkFolder(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

function setBreakpoints(breakpoints, prefix) {
  const dir = "./configs/settings";
  checkFolder(dir);

  const breakpointsArray = [];
  for (breakpoint in breakpoints) {
    breakpointsArray.push(`"${breakpoint}": ${breakpoints[breakpoint]}`);
  }

  const content = `
$mq-breakpoints: (
  ${breakpointsArray}
) !default;

$breakpointSeparator: \\${prefix} !default
`;

  fs.writeFile(`${dir}/_breakpoints.scss`, content, (err) => {
    if (err) console.log(err);
  });
}

fs.readFile("./configs/myitcss.json", "utf8", async (err, data) => {
  if (err) {
    console.log(err);
    return;
  }

  const myItConfigsRaw = JSON.parse(data);
  const myItConfigs = await setDefaults(myItConfigsRaw);

  setBreakpoints(
    myItConfigs.settings.breakpoints,
    myItConfigs.settings.prefixes.breakpointPrefix
  );
});
