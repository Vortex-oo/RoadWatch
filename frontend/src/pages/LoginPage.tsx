
export default function LoginPage() {
    function loginAsAdmin() {
        localStorage.setItem("token", "demo-token");

        localStorage.setItem(
            "user",
            JSON.stringify({
                name: "Demo Admin",
                email: "admin@potholewatch.com",
                role: "admin",
            })
        );

        window.location.href = "/admin";
    }

    function loginAsVerifier() {
        localStorage.setItem("token", "demo-token");

        localStorage.setItem(
            "user",
            JSON.stringify({
                name: "Demo Verifier",
                email: "verifier@potholewatch.com",
                role: "verifier",
            })
        );

        window.location.href = "/admin";
    }

    return (
        <div className="flex min-h-[80vh] items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <h1 className="text-2xl font-bold text-slate-900">
                    PotholeWatch Login
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Choose a demo account to preview the dashboard.
                </p>

                <button
                    onClick={loginAsAdmin}
                    className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
                >
                    Continue as Admin
                </button>

                <button
                    onClick={loginAsVerifier}
                    className="mt-3 w-full rounded-lg border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                >
                    Continue as Verifier
                </button>
            </div>
        </div>
    );
}
