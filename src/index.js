const core = require('@actions/core');
const exec = require('@actions/exec');
const chalk = require('chalk');

async function run() {
  try {
    await exec.getExecOutput("cargo", ["install", "cargo-verison"]);
    const version_output = await exec.getExecOutput("cargo-verison", [ "current" ]);
    const prev_version = (await version_output).stdout.trim();
    core.setOutput("prev_version", prev_version);

    // version
    const version = core.getInput('version');
    console.log(chalk.blue(`Version: ${version}!`));

    // message
    const message = core.getInput('message');
    console.log(chalk.blue(`Message: ${message}`));

    // git-tag-version
    const git_tag_version = core.getInput('git-tag-version');
    console.log(chalk.blue(`Git tag version: ${git_tag_version}`));

    let params = [ version, "-m", message ];
    if (git_tag_version === 'false' || git_tag_version === false) {
      params.push('--git-tag-version=false');
    }
  
    const output = await exec.getExecOutput('cargo-verison', params, { silent: true })
    const new_version = output.stdout.trim();
    core.setOutput("next_version", new_version);

    console.log(chalk.green(`Previous version: ${prev_version}`));
    console.log(chalk.green(`Next version: ${prev_version}`));
  } catch (error) {
    core.setFailed(error.message);
  }  
}

run();
