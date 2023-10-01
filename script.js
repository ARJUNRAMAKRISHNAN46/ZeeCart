//node mailer stuff
let transporter = nodemailer.createTransport({
    service:"gmail",
    auth : {
        user : process.env.AUTH_EMAIL,
        pass : process.env.AUTH_PASS
    },
})
//testing success
transporter.verify((error,success) =>{
    if( error ) {
        console.log(error);
    }else{
        console.log('Ready for message');
        console.log(success);
    }
})
router.get("/user/send-otp",(req,res)=>{
    
})
// send otp verification

const sendOTPVerificationEmail = async()=>{
    try {
        const otp = `${Math.floor(100000 + Math.random() * 900000)}`
        //mail options
        const mailOptions = {
            from : process.env.AUTH_EMAIL,
            to : email,
            subject : 'Verify Your Email',
            html : `<p>Enter <b> ${otp}</b> in the app to verify your email address </p><p> This code <b> expires in 5 minutes </b>.</p>`
        };
        //hash the otp
        const saltRounds = 10;
        const hashedOTP = await bcrypt.hash(otp,saltRounds);
        const newOTPVerification = await new userOTPVerification({
            userId : _id,
            createdAt : Date.now(),
            expiresAt : Date.now() + 300
        })
        //save otp record
        await newOTPVerification.save();
        await transporter.sendMail(mailOptions);
        // res.json({
        //     status : 'PENDING',
        //     message : 'Verification otp mail send',
        //     data : {
        //         userId : _id,
        //         email,
        //     }
        // })
    } catch (error) {
        // res.json({
        //     status : 'FAILED',
        //     massage : error.message
        // })
    }
}

sendOTPVerificationEmail();

//verify otp email
router.post('/verifyOTP',async(req,res) => {
    try {
        let { userId,otp } = req.body;
        if( !userId || !otp ){
            throw Error('Empty otp details are not allowed');
        }else{
            const userOTPVerificationRecords = await userOTPVerification.find({
                userId,
            })
            if(userOTPVerificationRecords.length <= 0){
                //no record found
                throw new Error(
                    "Account record doesn't exist or has been verified already . Please sign up or log in "
                )
            }else{
                //user otp record exists
                const { expiresAt } = userOTPVerificationRecords[0];
                const hashedOTP = userOTPVerificationRecords[0].otp;

                if(expiresAt < Date.now()) {
                    //user otp record has expired
                    await userOTPVerification.deleteMany({ userId });
                    throw new Error('Code has been expired . Please request again');
                }else{
                    const validOTP = await bcrypt.compare(otp,hashedOTP);
                    if(!validOTP) {
                        //supplied otp is wrong
                        throw new Error('Invalid code password . Check your inbox. ')
                    }else{
                        //success
                        await UserSchema.updateMany({ _id : userId },{verified : true});
                        await userOTPVerification.deleteMany({ userId });
                        res.json({
                            status : "VERIFIED",
                            message : `User mail verified successfully `
                        })
                    }
                }
            }
        }
    } catch (error) {
        res.json({
            status : "FAILED",
            message : error.message
        })
    }
})

//resend verification
router.post('/resendOTPVerificationCode',async(req,res)=>{
    try {
        let { userId, email } = req.body;

        if(!userId || !email){
            throw Error('Empty user details are not allowed');
        }else{
            //delete existing recodes and resend
            await userOTPVerification.deleteMany({ userId });
            sendOTPVerificationEmail({ _id : userId ,email }, res)
        }
    } catch (error) {
        res.json({
            status : "FAILED",
            message : error.message,
        })
    }
})
{/* <table class="table table-borderedmy-0 mx-auto container" style="margin-top: 10px;">
            <thead>
                <tr>
                    <th class="thed" scope="col">No.</th>
                    <th class="thed" scope="col">Brand Name</th>
                    <th class="thed" scope="col">Edit</th>
                    <th class="thed" scope="col">Remove</th>
                </tr>
            </thead>
            <tbody>
                <% brand.forEach((x)=>{%>
                    <tr>
                        <td><%= ++i %></td>
                        <td><%= x.name %></td>
                        <td>EDIT</td>
                        <td>REMOVE</td>
                    </tr>
                    <%}) %>
            </tbody>
        </table> */}

//         <%- include('../layout/header.ejs') %>
// <style>
//     @media screen and (max-width : 850px){
//         .sidenav{
//             width: 0;
//         }
//         .duplicate{
//             width : 0;
//         }
//     }
// </style>
// <span style="font-size:30px;cursor:pointer" class="openNav" onclick="openNav()">&#9776;</span>
// <div id="mySidenav" class="sidenav">
//     <div class="d-flex align-items-center justify-content-end"><a href="javascript:void(0)" class="closebtn" onclick="closeNav()"><i class="fa-solid fa-arrow-left"></i></i></a></div>
//     <!-- &times; -->
//     <div class="zeediv d-flex align-items-center justify-content-center"><h3 class="zeecart">Zee<span href="" id="zeecart">C</span>art</h3></div>

//     <div class="btnz d-flex align-items-center justify-content-center"><span><a class="a-tag"  href="">Dashboard</a></span></div>
//     <div class="btnz d-flex align-items-center justify-content-center"><span><a class="a-tag"  href="">Products</a></span></div>
//     <div class="btnz d-flex align-items-center justify-content-center"><span><a class="a-tag"  href="/catagory">Catagory</a></span></div>
//     <div class="btnz d-flex align-items-center justify-content-center"><span><a class="a-tag"  href="/brands">Brand</a></span></div>
//     <div class="btnz d-flex align-items-center justify-content-center"><span><a class="a-tag"  href="">Payments</a></span></div>
//     <div class="btnz d-flex align-items-center justify-content-center"><span><a class="a-tag"  href="">Admins</a></span></div>
//     <div class="btnz d-flex align-items-center justify-content-center"><span><a class="a-tag"  href="/customers">Customers</a></span></div>
//     <div class="btnz d-flex align-items-center justify-content-center"><span><a class="a-tag"  href="">Orders</a></span></div>
//     <div class="btnz d-flex align-items-center justify-content-center"><span><a class="a-tag"  href="">Coupen</a></span></div>
//     <div class="btnz d-flex align-items-center justify-content-center"><span><a class="a-tag"  href="">Banner</a></span></div>
//     <div class="btnz d-flex align-items-center justify-content-center"><span><a class="a-tag"  href=""></a></span></div>

  
// </div>
// <div class="d-flex">
//     <div class="duplicate">
    
//     </div>
//     <table class="table table-borderedmy-0 mx-auto container" style="margin-top: 10px;">
//         <thead>
//             <tr>
//                 <th class="thead" scope="col">No.</th>
//                 <th class="thead" scope="col">Brand Name</th>
//                 <th class="thead" scope="col">Edit</th>
//                 <th class="thead" scope="col">Remove</th>
//             </tr>
//         </thead>
//         <tbody>
//             <%brandz.forEach((x)=>{ %>
//                 <tr>
//                     <td><i><%=++i%></i></td> 
//                     <td><i><%=x.brandName%></i></td>
//                     <td><i>EDIT</i></td><br>
//                     <td><i>REMOVE</i></td>
//                 </tr>
//             <%}) %>
//         </tbody>
//     </table>
// </div>

// <script>
//     function openNav() {
//       document.getElementById("mySidenav").style.width = "200px";
//     }
    
//     function closeNav() {
//       document.getElementById("mySidenav").style.width = "0";
//     }
//     </script>

// <%- include('../layout/footer.ejs') %>