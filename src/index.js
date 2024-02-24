const core = require('@actions/core');
const exec = require('@actions/exec');
// const github = require('@actions/github');

async function run() {
  try {
    // version
    const version = core.getInput('version');
    console.log(`Version: ${version}!`);

    // message
    const message = core.getInput('message');
    console.log(`Message: ${message}`);

    // git-tag-version
    const git_tag_version = core.getInput('git-tag-version');
    console.log(`Git tag version: ${git_tag_version}`);
    // const time = (new Date()).toTimeString();
    // core.setOutput("time", time);

    // // Get the JSON webhook payload for the event that triggered the workflow
    // const payload = JSON.stringify(github.context.payload, undefined, 2)
    // console.log(`The event payload: ${payload}`);
  
    let command = `cargo verison ${version} -m "${message}"`;
    if (git_tag_version === 'false' || git_tag_version === false) {
      command += ' --git-tag-version=false'
    }
  
    const output = await exec.getExecOutput('ls', ['-lah'], { silent: true })
    let new_version = output.stdout.trim();
    core.setOutput("new_version", new_version);
  
    console.log(`I will run command: ${command}`);
  } catch (error) {
    core.setFailed(error.message);
  }  
}

run();
