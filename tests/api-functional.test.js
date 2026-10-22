/**
 * StudyNotion API Functional & Security Test Suite
 * Automatically tests server health, course queries, authentication validation,
 * and security / authorization access controls.
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:5050";

const testResults = [];

function logSection(title) {
  console.log(`\n======================================================`);
  console.log(`  ${title}`);
  console.log(`======================================================`);
}

async function runTest(name, fn) {
  const start = performance.now();
  try {
    await fn();
    const duration = (performance.now() - start).toFixed(2);
    console.log(`  ✅ [PASS] ${name} (${duration}ms)`);
    testResults.push({ name, status: "PASS", duration: Number(duration) });
  } catch (error) {
    const duration = (performance.now() - start).toFixed(2);
    console.error(`  ❌ [FAIL] ${name} (${duration}ms)`);
    console.error(`     Error: ${error.message}`);
    testResults.push({ name, status: "FAIL", duration: Number(duration), error: error.message });
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

async function runAllTests() {
  console.log(`\nStarting StudyNotion API Test Suite on ${BASE_URL} ...\n`);

  let sampleCourseId = null;
  let sampleCategoryId = null;

  // 1. Health & Core Endpoints
  logSection("1. Health & Server Status Endpoints");

  await runTest("GET / - Server Health Check", async () => {
    const res = await fetch(`${BASE_URL}/`);
    assert(res.status === 200, `Expected status 200, got ${res.status}`);
    const data = await res.json();
    assert(data.success === true, "Expected success: true");
    assert(typeof data.message === "string", "Expected message string");
  });

  await runTest("GET /test - Frontend Connection Ping", async () => {
    const res = await fetch(`${BASE_URL}/test`);
    assert(res.status === 200, `Expected status 200, got ${res.status}`);
    const text = await res.text();
    assert(text === "OK", `Expected "OK", got "${text}"`);
  });

  // 2. Course & Catalog Endpoints
  logSection("2. Course & Catalog API Endpoints");

  await runTest("GET /api/v1/course/getAllCourses - List All Courses", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/course/getAllCourses`);
    assert(res.status === 200, `Expected status 200, got ${res.status}`);
    const data = await res.json();
    assert(data.success === true, "Expected success: true");
    assert(Array.isArray(data.data), "Expected data to be an array");
    assert(data.data.length > 0, "Expected at least one course in the database");
    sampleCourseId = data.data[0]._id;
    assert(data.data[0].courseName, "Course should have courseName");
  });

  await runTest("GET /api/v1/course/showAllCategories - List All Categories", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/course/showAllCategories`);
    assert(res.status === 200, `Expected status 200, got ${res.status}`);
    const data = await res.json();
    assert(data.success === true, "Expected success: true");
    assert(Array.isArray(data.data), "Expected data to be an array");
    assert(data.data.length > 0, "Expected at least one category");
    sampleCategoryId = data.data[0]._id;
    assert(data.data[0].name, "Category should have name property");
  });

  await runTest("POST /api/v1/course/getCourseDetails - Get Specific Course Details", async () => {
    assert(sampleCourseId, "Sample course ID not available");
    const res = await fetch(`${BASE_URL}/api/v1/course/getCourseDetails`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId: sampleCourseId }),
    });
    assert(res.status === 200, `Expected status 200, got ${res.status}`);
    const data = await res.json();
    assert(data.success === true, "Expected success: true");
    const course = data.data?.courseDetails || data.data;
    assert(course && course._id === sampleCourseId, "Course ID mismatch in response");
  });

  await runTest("POST /api/v1/course/getCategoryPageDetails - Category Details Page", async () => {
    assert(sampleCategoryId, "Sample category ID not available");
    const res = await fetch(`${BASE_URL}/api/v1/course/getCategoryPageDetails`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryId: sampleCategoryId }),
    });
    assert(res.status === 200, `Expected status 200, got ${res.status}`);
    const data = await res.json();
    assert(data.success === true, "Expected success: true");
    assert(data.data, "Expected category page data");
  });

  await runTest("GET /api/v1/course/getReviews - Public Reviews & Ratings", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/course/getReviews`);
    assert(res.status === 200, `Expected status 200, got ${res.status}`);
    const data = await res.json();
    assert(data.success === true, "Expected success: true");
    assert(Array.isArray(data.data), "Expected reviews array");
  });

  await runTest("GET /api/v1/course/getAverageRating - Average Course Rating", async () => {
    assert(sampleCourseId, "Sample course ID not available");
    const res = await fetch(`${BASE_URL}/api/v1/course/getAverageRating?courseId=${sampleCourseId}`);
    assert(res.status === 200, `Expected status 200, got ${res.status}`);
    const data = await res.json();
    assert(data.success === true, "Expected success: true");
    assert(typeof data.averageRating === "number", "Expected averageRating number");
  });

  // 3. Authentication & Input Validation
  logSection("3. Authentication & Input Validation Endpoints");

  await runTest("POST /api/v1/auth/login - Reject Missing Email/Password", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "" }),
    });
    assert(res.status === 400 || res.status === 403, `Expected status 400 or 403, got ${res.status}`);
    const data = await res.json();
    assert(data.success === false, "Expected success: false for invalid login payload");
  });

  await runTest("POST /api/v1/auth/login - Reject Invalid Credentials", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "nonexistent_tester_12345@example.com",
        password: "WrongPassword!999",
      }),
    });
    assert(res.status === 401 || res.status === 400 || res.status === 403, `Expected auth failure status, got ${res.status}`);
    const data = await res.json();
    assert(data.success === false, "Expected success: false for nonexistent user");
  });

  await runTest("POST /api/v1/auth/signup - Validate Missing Required Fields", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName: "Test" }),
    });
    assert(res.status === 403 || res.status === 400, `Expected 403/400 validation error, got ${res.status}`);
    const data = await res.json();
    assert(data.success === false, "Expected success: false when fields missing");
  });

  await runTest("POST /api/v1/auth/signup - Validate Password Mismatch", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        password: "Password123",
        confirmPassword: "MismatchPassword456",
        accountType: "Student",
        otp: "123456",
      }),
    });
    assert(res.status === 400, `Expected 400 for password mismatch, got ${res.status}`);
    const data = await res.json();
    assert(data.success === false, "Expected success: false for password mismatch");
  });

  // 4. Protected Routes & Authorization Guards
  logSection("4. Protected Route Security & Token Verification");

  await runTest("GET /api/v1/profile/getUserDetails - Reject Missing JWT Token", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/profile/getUserDetails`);
    assert(res.status === 401, `Expected status 401 Unauthorized, got ${res.status}`);
    const data = await res.json();
    assert(data.success === false, "Expected success: false");
    assert(data.message.toLowerCase().includes("token"), "Message should mention missing token");
  });

  await runTest("GET /api/v1/profile/getEnrolledCourses - Reject Missing JWT Token", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/profile/getEnrolledCourses`);
    assert(res.status === 401, `Expected status 401 Unauthorized, got ${res.status}`);
    const data = await res.json();
    assert(data.success === false, "Expected success: false");
  });

  await runTest("GET /api/v1/profile/instructorDashboard - Reject Unauthorized Role/Token", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/profile/instructorDashboard`);
    assert(res.status === 401, `Expected status 401 Unauthorized, got ${res.status}`);
    const data = await res.json();
    assert(data.success === false, "Expected success: false");
  });

  await runTest("POST /api/v1/course/createCourse - Reject Course Creation Without Auth", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/course/createCourse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseName: "Hacker Course" }),
    });
    assert(res.status === 401, `Expected 401 Unauthorized, got ${res.status}`);
  });

  await runTest("POST /api/v1/payment/capturePayment - Reject Payment Capture Without Auth", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/payment/capturePayment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courses: [sampleCourseId] }),
    });
    assert(res.status === 401, `Expected 401 Unauthorized, got ${res.status}`);
  });

  // Summary Report
  logSection("API Testing Summary Report");
  const passed = testResults.filter((t) => t.status === "PASS").length;
  const failed = testResults.filter((t) => t.status === "FAIL").length;
  const totalDuration = testResults.reduce((acc, t) => acc + t.duration, 0).toFixed(2);
  const avgDuration = (totalDuration / testResults.length).toFixed(2);

  console.log(`  Total Tests Run:  ${testResults.length}`);
  console.log(`  Passed:           ${passed} ✅`);
  console.log(`  Failed:           ${failed} ${failed > 0 ? "❌" : "🎉"}`);
  console.log(`  Average Latency:  ${avgDuration} ms`);
  console.log(`  Total Execution:  ${totalDuration} ms`);
  console.log(`======================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error("Fatal Test Runner Error:", err);
  process.exit(1);
});
