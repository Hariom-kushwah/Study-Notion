/**
 * StudyNotion Load & Performance Testing Framework
 * Automated load runner using programmatic autocannon engine.
 */

const path = require("path");
const fs = require("fs");
const autocannon = require(path.join(__dirname, "../server/node_modules/autocannon"));

const BASE_URL = process.env.BASE_URL || "http://localhost:5050";

// Helper to run autocannon as a Promise
function runAutocannon(opts) {
  return new Promise((resolve, reject) => {
    autocannon(opts, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
}

async function getSeedData() {
  try {
    const courseRes = await fetch(`${BASE_URL}/api/v1/course/getAllCourses`);
    const courseJson = await courseRes.json();
    const courseId = courseJson?.data?.[0]?._id || "6a49809f4529916be23d7dce";

    const catRes = await fetch(`${BASE_URL}/api/v1/course/showAllCategories`);
    const catJson = await catRes.json();
    const categoryId = catJson?.data?.[0]?._id || "6a4945d0592c42cdd54f835c";

    return { courseId, categoryId };
  } catch (err) {
    console.warn("Could not fetch dynamic seed data, falling back to defaults:", err.message);
    return {
      courseId: "6a49809f4529916be23d7dce",
      categoryId: "6a4945d0592c42cdd54f835c",
    };
  }
}

async function runLoadTests() {
  console.log(`\n================================================================`);
  console.log(`🚀 Starting StudyNotion Comprehensive Performance & Load Testing`);
  console.log(`   Target Server: ${BASE_URL}`);
  console.log(`================================================================\n`);

  const { courseId, categoryId } = await getSeedData();
  console.log(`Using Test Fixtures:`);
  console.log(`  - Target Course ID:   ${courseId}`);
  console.log(`  - Target Category ID: ${categoryId}\n`);

  const scenarios = [
    {
      name: "1. Baseline Server Health Check (GET /)",
      url: `${BASE_URL}/`,
      method: "GET",
      tests: [
        { connections: 10, duration: 5, label: "Concurrency 10" },
        { connections: 50, duration: 5, label: "Concurrency 50" },
        { connections: 100, duration: 5, label: "Concurrency 100" },
      ],
    },
    {
      name: "2. Database Read: Show All Categories (GET /api/v1/course/showAllCategories)",
      url: `${BASE_URL}/api/v1/course/showAllCategories`,
      method: "GET",
      tests: [
        { connections: 10, duration: 5, label: "Concurrency 10" },
        { connections: 25, duration: 5, label: "Concurrency 25" },
        { connections: 50, duration: 5, label: "Concurrency 50" },
      ],
    },
    {
      name: "3. Database Read: List All Courses with Instructor Population (GET /api/v1/course/getAllCourses)",
      url: `${BASE_URL}/api/v1/course/getAllCourses`,
      method: "GET",
      tests: [
        { connections: 10, duration: 5, label: "Concurrency 10" },
        { connections: 25, duration: 5, label: "Concurrency 25" },
        { connections: 50, duration: 5, label: "Concurrency 50" },
      ],
    },
    {
      name: "4. Parameterized Query: Deep Course Details (POST /api/v1/course/getCourseDetails)",
      url: `${BASE_URL}/api/v1/course/getCourseDetails`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
      tests: [
        { connections: 10, duration: 5, label: "Concurrency 10" },
        { connections: 25, duration: 5, label: "Concurrency 25" },
        { connections: 50, duration: 5, label: "Concurrency 50" },
      ],
    },
    {
      name: "5. Auth / Security Endpoint Stress: Login Validation (POST /api/v1/auth/login)",
      url: `${BASE_URL}/api/v1/auth/login`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "stress_test_user@example.com", password: "TestPassword123!" }),
      tests: [
        { connections: 5, duration: 5, label: "Concurrency 5" },
        { connections: 10, duration: 5, label: "Concurrency 10" },
        { connections: 20, duration: 5, label: "Concurrency 20" },
      ],
    },
    {
      name: "6. Reviews & Rating Feed (GET /api/v1/course/getReviews)",
      url: `${BASE_URL}/api/v1/course/getReviews`,
      method: "GET",
      tests: [
        { connections: 10, duration: 5, label: "Concurrency 10" },
        { connections: 30, duration: 5, label: "Concurrency 30" },
        { connections: 60, duration: 5, label: "Concurrency 60" },
      ],
    },
  ];

  const allResults = [];

  for (const scenario of scenarios) {
    console.log(`----------------------------------------------------------------`);
    console.log(`▶ Executing Scenario: ${scenario.name}`);
    console.log(`----------------------------------------------------------------`);

    for (const test of scenario.tests) {
      process.stdout.write(`  ⏳ Running ${test.label} (${test.connections} conns, ${test.duration}s)... `);

      const opts = {
        url: scenario.url,
        method: scenario.method,
        connections: test.connections,
        duration: test.duration,
        headers: scenario.headers || {},
        body: scenario.body || undefined,
        pipelining: 1,
      };

      try {
        const res = await runAutocannon(opts);
        const rps = Math.round(res.requests.average);
        const p50 = res.latency.p50;
        const p90 = res.latency.p90;
        const p99 = res.latency.p99;
        const maxLat = res.latency.max;
        const throughput = formatBytes(res.throughput.average) + "/s";
        const errors = res.errors + res.timeouts;

        console.log(`DONE: ${rps.toLocaleString()} req/s | p50: ${p50}ms | p90: ${p90}ms | p99: ${p99}ms | Errors: ${errors}`);

        allResults.push({
          scenario: scenario.name,
          concurrency: test.connections,
          duration: test.duration,
          totalRequests: res.requests.total,
          rps,
          avgLatency: res.latency.average,
          p50,
          p90,
          p99,
          maxLatency: maxLat,
          throughput,
          errors,
          timeouts: res.timeouts,
          status2xx: res["2xx"] || 0,
          statusNon2xx: res.non2xx || 0,
        });
      } catch (err) {
        console.log(`FAILED: ${err.message}`);
        allResults.push({
          scenario: scenario.name,
          concurrency: test.connections,
          duration: test.duration,
          error: err.message,
        });
      }
    }
    console.log();
  }

  // Print Summary Table
  console.log(`\n=========================================================================================================`);
  console.log(`📊 FINAL LOAD TESTING BENCHMARK SUMMARY`);
  console.log(`=========================================================================================================`);
  console.log(
    "Scenario".padEnd(38) +
    "Conns".padStart(6) +
    "Req/s".padStart(11) +
    "p50(ms)".padStart(9) +
    "p90(ms)".padStart(9) +
    "p99(ms)".padStart(9) +
    "Max(ms)".padStart(9) +
    "Total Req".padStart(11) +
    "Errors".padStart(8)
  );
  console.log("-".repeat(110));

  for (const r of allResults) {
    if (r.error) {
      console.log(`${r.scenario.slice(0, 36).padEnd(38)}${String(r.concurrency).padStart(6)}   FAILED: ${r.error}`);
      continue;
    }
    console.log(
      r.scenario.slice(0, 36).padEnd(38) +
      String(r.concurrency).padStart(6) +
      r.rps.toLocaleString().padStart(11) +
      String(r.p50).padStart(9) +
      String(r.p90).padStart(9) +
      String(r.p99).padStart(9) +
      String(r.maxLatency).padStart(9) +
      r.totalRequests.toLocaleString().padStart(11) +
      String(r.errors).padStart(8)
    );
  }
  console.log(`=========================================================================================================\n`);

  // Write structured JSON results to disk for reporting
  const reportPath = path.join(__dirname, "load-test-results.json");
  fs.writeFileSync(reportPath, JSON.stringify(allResults, null, 2), "utf8");
  console.log(`Saved detailed load test data to: ${reportPath}\n`);

  return allResults;
}

runLoadTests().catch((err) => {
  console.error("Fatal error during load test:", err);
  process.exit(1);
});
