"use client";

export default function Footer() {
    return (
        <footer className="text-center text-gray-600 dark:text-gray-500 mt-12">
            <p>© {new Date().getFullYear()} Interview Prep Generator. Made with ❤️ for job seekers.</p>
            <p><a target="_blank" className="underline" href="https://antigravity.google/">Google Antigravity</a> agents did the heavy lifting. A human <a target="_blank" className="underline" href="https://mrmallik.com" title="Gulger Mallik">engineer</a> did the thinking.</p>
        </footer>
    );
}