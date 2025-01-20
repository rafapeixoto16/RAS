<template>
  <div class="flex min-h-screen w-full bg-white">
    <div class="w-full flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div class="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div class="absolute bottom-0 left-20 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        <div class="absolute inset-0 animate-float">
          <div class="absolute top-1/4 left-1/4 w-12 h-12 bg-blue-400 rounded-lg rotate-45 opacity-20"></div>
          <div class="absolute top-3/4 right-1/4 w-16 h-16 bg-blue-300 rounded-full opacity-20"></div>
          <div class="absolute bottom-1/4 left-1/2 w-20 h-20 bg-blue-200 rounded-lg rotate-12 opacity-20"></div>
        </div>
      </div>

      <div class="w-full max-w-md relative z-10">
        <div class="text-center mb-10">
          <h1 class="text-4xl font-bold text-blue-600 mb-2">End-User License Agreement (EULA)</h1>
        </div>
        <div class="space-y-6 backdrop-blur-sm bg-white bg-opacity-50 p-8 rounded-xl shadow-lg border border-white border-opacity-20">
          <div class="eula-content">
            <pre class="whitespace-pre-wrap">{{ eulaText }}</pre>
            <a href="mailto:picturas.geral@picturas.pt" class="text-blue-600 hover:text-blue-800 transition-colors duration-200 hover:underline">picturas.geral@picturas.pt</a>
          </div>
          <router-link to="/login" class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg text-center block">Back to Login</router-link>
          <router-link to="/register" class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg text-center block">Back to Register</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";

export default {
  name: "EulaView",
  setup() {
    const eulaText = ref(`
END-USER LICENSE AGREEMENT (EULA)
Last Updated: January 20, 2025
This End User License Agreement, including any supplemental terms
(collectively hereinafter, the "EULA") is a legally binding agreement
between users (hereinafter, "you," "your," "user," "registered user") and <a href="https://www.picturas.pt">PictuRas</a>
(hereinafter, the "Company," "we," "us,"
"our) and governs your use of PictuRas (hereinafter, the
"App") provided by the Company.
Your use of the App, and any future release, update, or any other addition
to the functionality thereof, shall be subject to the terms prescribed by
the Terms and Conditions (hereinafter, T&C) and the EULA of <a href="https://www.picturas.pt">PictuRas</a>
.
You are advised to read this EULA and our T&C with attention and care.
By accessing or using the App, or any software therein, you formally
accept, give consent, and agree to the terms of the EULA and T&C. If
you do not agree with the prescribed T&C and EULA to the App, you may
not access, use or otherwise download the App.
Upon visiting, accessing, entering, downloading or otherwise using the App,
you hereby agree and give your formal consent to the use of electronic
communication to enter into legally binding contracts to the extent
permitted by applicable laws.
You hereby waive any rights under any laws and regulations that may require
an original (non-electric) signature to constitute a legally binding
contract.
Ownership
The App and all worldwide copyrights, trade secrets, trademarks and other
intellectual property rights therein, are the exclusive property of the
Company. We reserve all rights in and to the App.
License
Subject to the terms under this EULA, we hereby grant you a revocable,
non-exclusive, non-transferable, limited license to access, visit,
download, install and use the App solely for your personal, non-commercial
purposes, strictly in accordance with the terms of this EULA and T&C.
You may, further, use the app to create content, strictly for your
personal, non-commercial purposes. The App shall not be used for any other
purpose not prescribed in this EULA.
<a href="https://www.picturas.pt">PictuRas</a>
reserves the exclusive right to revoke, terminate or limit your license
and/or use of the App without notice.
Term and Termination
The EULA and the license granted hereunder shall be deemed to come into
effect on the date you first use, access or download the App, and shall
continue unless this EULA is terminated by you or <a href="https://www.picturas.pt">PictuRas</a>
.
This EULA may terminate on itself without notice from <a href="https://www.picturas.pt">PictuRas</a>
if you fail to comply
with
any terms of the
EULA.
We reserve the absolute right to terminate this EULA without notice or
reason.
You may terminate the EULA at any time, by permanently deleting, destroying
and returning, at your own cost, the App, all backup copies, and all
related materials provided by <a href="https://www.picturas.pt">PictuRas</a>
.
Upon termination of this EULA, the license granted hereunder shall
terminate and you shall stop all use of the App immediately.
Restrictions on Users
You agree not to, and you shall not permit others to:
license, sell, rent, lease, transfer, assign, distribute, transmit,
host, outsource, disclose or otherwise commercially exploit the App or make
the App available to any third parties;
copy or use the App for any purpose other than your own personal,
non-commercial purposes;
copy or use the App to facilitate any criminal activity, including but
not limited to hacking; or
modify, make derivative works of, disassemble, decrypt, translate,
reverse compile or reverse engineer any part of the App.
Limitation of Liability
Notwithstanding anything written herein to the contrary, and to the extent
permitted under applicable laws, you and <a href="https://www.picturas.pt">PictuRas</a>
hereby acknowledge and agree that we will not be liable
for any losses or damages, whether indirect, incidental, special,
consequential, exemplary, or punitive, or for any loss of use, or lost
data, even if we have been advised of the possibility of such damages.
Notwithstanding anything written herein to the contrary, and to the extent
permitted under applicable laws, you and <a href="https://www.picturas.pt">PictuRas</a>
hereby acknowledge and agree that the total cumulative
liability in connection with the App, its Terms and Conditions and this
EULA, shall at all times, whether in contract or tort or otherwise, be
limited to a maximum of a hundred (U.S. $ 100 / USD 100). The existence of
more than one claim shall not enlarge or deviate or alter this prescribed
limit. <a href="https://www.picturas.pt">PictuRas</a>
disclaims any liability of any kind,
and you hereby, by accessing, downloading, registering, or using the App,
give your formal consent to this, and every other clause/provision of this
EULA.
Severability and Disclaimers
Neither the rights nor the obligations arising under this EULA are
assignable by you, and any such attempted assignment or transfer shall be
void and without effect. We reserve the right to freely assign this EULA.
The United Nations Convention on Contracts for the International Sale of
Goods shall not apply to this EULA. Any notice to you may be provided by
email to the address you have registered with us. We shall have no
responsibility to provide maintenance or support services with respect to
the App.
If any provision of this EULA is unenforceable, such provision shall be
interpreted to accomplish the objectives of such provision to the greatest
extent possible under applicable law and the remaining provisions shall
continue in full force and effect.
All waivers by us shall be effective only if in writing. Any waiver or
failure by <a href="https://www.picturas.pt">PictuRas</a>
to enforce any provision of this
EULA on one occasion shall not be deemed a waiver of any other provision or
of such provision on any other occasion.
You acknowledge that the App contains valuable trade secrets, trademarks,
copyrights, proprietary information and other intellectual properties of <a href="https://www.picturas.pt">PictuRas</a>
,
that
any actual or threatened breach of
any section of this EULA that may constitute irreparable harm to <a href="https://www.picturas.pt">PictuRas</a>
shall be
liable
to any and every damages,
including but not limited to, incidental damages, consequential damages,
nominal damages, liquidated damages, punitive damages, monetary or any
special kind of damages permitted by applicable laws, as an appropriate
remedy for such breach. This EULA and the Terms constitute the final,
complete, and exclusive agreement between the parties regarding the App and
supersede all prior or contemporaneous agreements, understandings, and
communication, whether written or oral.
INTELLECTUAL PROPERTY
You hereby unconditionally agree that all right, title and interest in the copyrights and other intellectual
property rights in the App reside with the <a href="https://www.picturas.pt">PictuRas</a>
. The trademarks, logos, designs,
and service
marks appearing on the App are registered and unregistered marks of <a href="https://www.picturas.pt">PictuRas</a>
.
Accordingly,
nothing in this EULA or the App grants you any right to use any form of intellectual property
contained in the App.
Therefore, all rights, titles, interests, and copyrights in and/or to the App, including but not limited
to all images, graphics, animations, audio, video, music, text, data, code, algorithm, and information, are
owned by the <a href="https://www.picturas.pt">PictuRas</a>
. Accordingly, the App is protected by all applicable copyright
laws and international
treaties, and the Licensee is expected to use the App concerning all intellectual property contained therein,
except as otherwise provided for in this EULA.
Amendments
We reserve the sole right to amend, repeal, modify, replace, terminate or
make changes to this EULA, and the App without notice, from time to time.
If we make material changes to this EULA, or the App, we shall notify you
by sending you an
e-mail at your primary email address or in any other way convenient for us,
as mentioned in your account details.
Any changes to this EULA, or App, shall be effective immediately for new
users of our App; otherwise these changes shall be effective upon the
earliest of thirty (30) calendar days following our dispatch of an e-mail
notice to you. You are responsible at all times for updating your Account
to provide to us your most current e-mail address. If the last e-mail
address that you have provided to us is not valid, or for any reason is not
capable of delivering the notice described above, our dispatch of the
e-mail containing such notice shall nonetheless constitute effective notice
of the changes. Continued use of the App following notice of such changes
shall indicate your acknowledgement of, and EULA to be bound by, such
changes.
Disclaimer: Warranty
To the extent permitted under Applicable laws, you acknowledge that we
provide the App "as-is" without any warranty of any kind, express or
implied, and to the maximum extent permitted by Applicable law. We disclaim
all warranties, whether express, implied, or statutory, including but not
limited to, warranties of merchantability, fitness for a particular
purpose, title, quiet enjoyment, accuracy, and non-infringement. We do not
guarantee any specific results from the use of our App. We make no warranty
that the App shall be uninterrupted, free of viruses, or other harmful
code, timely, secure or error or bug free.
CONTACT US
For any questions or queries regarding this End User License Agreement, please feel free to contact us:
    `);
    return {
      eulaText,
    };
  },
};
</script>

<style scoped>
@keyframes blob {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(20px, -50px) scale(1.1);
  }
  50% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  75% {
    transform: translate(50px, 50px) scale(1.05);
  }
}

.animate-blob {
  animation: blob 20s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) rotate(5deg);
  }
  50% {
    transform: translateY(0) rotate(-5deg);
  }
  75% {
    transform: translateY(20px) rotate(5deg);
  }
}

.animate-float {
  animation: float 15s infinite;
}
</style>