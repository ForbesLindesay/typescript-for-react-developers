const { spawnSync } = require("child_process");
const { readdirSync } = require("fs");

const exercises = readdirSync("exercises")
  .filter((name) => /(\d+)\-.+/.test(name))
  .sort();

let lastDiff = null;
for (const exercise of exercises) {
  if (lastDiff?.trim()) {
    console.warn(`Applying diff to ${exercise}`);
    const applyProc = spawnSync(
      `git`,
      [`apply`, `--directory`, `exercises/${exercise}`],
      {
        input: lastDiff,
        // cwd: `exercises/${exercise}`,
        stdout: "inherit",
        stderr: "inherit",
      },
    );
    if (applyProc.error) throw applyProc.error;
    if (applyProc.status !== 0) {
      process.exit(1);
    }
  }

  const diffProc = spawnSync(`git`, [`diff`, `--relative`], {
    stderr: "inherit",
    cwd: `exercises/${exercise}`,
  });
  if (diffProc.error) throw diffProc.error;
  if (diffProc.status !== 0) {
    console.error(diffProc.stdout.toString());
    process.exit(1);
  }

  lastDiff = diffProc.stdout.toString();
  console.log("lastDiff =", lastDiff);
}

// const diffProc = spawnSync(`git`, [`diff`]);
// if (diffProc.error) throw diffProc.error;
// if (diffProc.status !== 0) {
//   console.error(diffProc.stdout.toString());
//   console.error(diffProc.stderr.toString());
//   process.exit(1);
// }

// let diff = diffProc.stdout.toString();

// while (true) {
//   const newDiff = diff.replace(
//     /\/exercises\/(\d+\-.+)\//g,
//     (_, exerciseName) => {
//       const exerciseNumber = exercises.indexOf(exerciseName);
//       if (exerciseNumber === -1) {
//         console.error(`Exercise ${exerciseName} not found`);
//         process.exit(1);
//       }
//       const nextExerciseName = exercises.at(exerciseNumber + 1);
//       if (!nextExerciseName) {
//         return _;
//       }
//       return `/exercises/${nextExerciseName}/`;
//     },
//   );
//   if (newDiff === diff) break;
//   diff = newDiff;
//   spawnSync(`git`, [`apply`, ])
// }
