export const sendPasswordReset = `<style>
  .message-content {
    font-family: Arial, Helvetica, sans-serif;
    max-width: 600px;
    font-size: 18px;
    line-height: 21px;
  }
</style>

<div class="message-content">
  <p>Hello </p>
  <p>It looks like a password change for your account has been requested.</p>
  <p>If that was you, then click on the link below to choose a new password:</p>
  <p>
    <a href="{{link}}">Reset my password</a>
  </p>
  <p>If it wasn't you, then discard this email!</p>
  <p>
   Thanks! <br />
  </p>
</div>`;
