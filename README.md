## 1. What the Chrome Plugin Will Do

**User Flow**

1. User selects a paragraph on any webpage.
2. Right-click → **"Rephrase with RephraseGenie"** (or click extension icon).
3. Plugin sends text to OpenAI API.
4. RephraseGenie returns a rephrased version.
5. User can **copy or replace** the text.

---

## 2. High-Level Architecture

<pre class="overflow-visible! px-0!" data-start="603" data-end="827"><div class="contain-inline-size rounded-2xl corner-superellipse/1.1 relative bg-token-sidebar-surface-primary"><div class="sticky top-[calc(--spacing(9)+var(--header-height))] @w-xl/main:top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>Chrome Extension
│
├── </span><span>Content</span><span> Script
│   └── Reads selected </span><span>text</span><span></span><span>from</span><span> webpage
│
├── </span><span>Background</span><span> Service Worker
│   └── Calls OpenAI API securely
│
├── Popup UI (Optional)
│   └── Shows rephrased </span><span>text</span><span>
│
└── OpenAI API
</span></span></code></div></div></pre>

### Why this architecture?

* **Content script** → access webpage text
* **Background worker** → API calls (avoids CORS & security issues)
* **Popup** → UI for displaying result

---

## 3. Project Structure

<pre class="overflow-visible! px-0!" data-start="1037" data-end="1168"><div class="contain-inline-size rounded-2xl corner-superellipse/1.1 relative bg-token-sidebar-surface-primary"><div class="sticky top-[calc(--spacing(9)+var(--header-height))] @w-xl/main:top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>rephrase-plugin/
│
├── manifest</span><span>.json</span><span>
├── </span><span>background</span><span>.js</span><span>
├── </span><span>content</span><span>.js</span><span>
├── popup</span><span>.html</span><span>
├── popup</span><span>.js</span><span>
├── styles</span><span>.css</span><span>
└── icons/
</span></span></code></div></div></pre>

---

## 4. Step-by-Step Implementation

---

## Step 1: Create `manifest.json`

Chrome now requires  **Manifest V3** .

<pre class="overflow-visible! px-0!" data-start="1288" data-end="1725"><div class="contain-inline-size rounded-2xl corner-superellipse/1.1 relative bg-token-sidebar-surface-primary"><div class="sticky top-[calc(--spacing(9)+var(--header-height))] @w-xl/main:top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-json"><span><span>{</span><span>
  </span><span>"manifest_version"</span><span>:</span><span></span><span>3</span><span>,</span><span>
  </span><span>"name"</span><span>:</span><span></span><span>"RephraseGenie"</span><span>,</span><span>
  </span><span>"version"</span><span>:</span><span></span><span>"1.0"</span><span>,</span><span>
  </span><span>"description"</span><span>:</span><span></span><span>"Rephrase selected text using RephraseGenie"</span><span>,</span><span>
  </span><span>"permissions"</span><span>:</span><span></span><span>[</span><span>"contextMenus"</span><span>,</span><span></span><span>"storage"</span><span>,</span><span></span><span>"activeTab"</span><span>,</span><span></span><span>"scripting"</span><span>]</span><span>,</span><span>
  </span><span>"background"</span><span>:</span><span></span><span>{</span><span>
    </span><span>"service_worker"</span><span>:</span><span></span><span>"background.js"</span><span>
  </span><span>}</span><span>,</span><span>
  </span><span>"action"</span><span>:</span><span></span><span>{</span><span>
    </span><span>"default_popup"</span><span>:</span><span></span><span>"popup.html"</span><span>
  </span><span>}</span><span>,</span><span>
  </span><span>"content_scripts"</span><span>:</span><span></span><span>[</span><span>
    </span><span>{</span><span>
      </span><span>"matches"</span><span>:</span><span></span><span>[</span><span>"<all_urls>"</span><span>]</span><span>,</span><span>
      </span><span>"js"</span><span>:</span><span></span><span>[</span><span>"content.js"</span><span>]</span><span>
    </span><span>}</span><span>
  </span><span>]</span><span>
</span><span>}</span><span>
</span></span></code></div></div></pre>

---

## Step 2: Capture Selected Text (`content.js`)

<pre class="overflow-visible! px-0!" data-start="1781" data-end="1980"><div class="contain-inline-size rounded-2xl corner-superellipse/1.1 relative bg-token-sidebar-surface-primary"><div class="sticky top-[calc(--spacing(9)+var(--header-height))] @w-xl/main:top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-js"><span><span>chrome.</span><span>runtime</span><span>.</span><span>onMessage</span><span>.</span><span>addListener</span><span>(</span><span>(request, sender, sendResponse</span><span>) => {
  </span><span>if</span><span> (request.</span><span>type</span><span> === </span><span>"GET_SELECTED_TEXT"</span><span>) {
    </span><span>sendResponse</span><span>({ </span><span>text</span><span>: </span><span>window</span><span>.</span><span>getSelection</span><span>().</span><span>toString</span><span>() });
  }
});
</span></span></code></div></div></pre>

---

## Step 3: Create Right-Click Menu (`background.js`)

<pre class="overflow-visible! px-0!" data-start="2041" data-end="2222"><div class="contain-inline-size rounded-2xl corner-superellipse/1.1 relative bg-token-sidebar-surface-primary"><div class="sticky top-[calc(--spacing(9)+var(--header-height))] @w-xl/main:top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-js"><span><span>chrome.</span><span>runtime</span><span>.</span><span>onInstalled</span><span>.</span><span>addListener</span><span>(</span><span>() =></span><span> {
  chrome.</span><span>contextMenus</span><span>.</span><span>create</span><span>({
    </span><span>id</span><span>: </span><span>"rephrase"</span><span>,
    </span><span>title</span><span>: </span><span>"Rephrase with RephraseGenie"</span><span>,
    </span><span>contexts</span><span>: [</span><span>"selection"</span><span>]
  });
});
</span></span></code></div></div></pre>

---

## Step 4: Handle Menu Click & Call OpenAI API

<pre class="overflow-visible! px-0!" data-start="2277" data-end="3186"><div class="contain-inline-size rounded-2xl corner-superellipse/1.1 relative bg-token-sidebar-surface-primary"><div class="sticky top-[calc(--spacing(9)+var(--header-height))] @w-xl/main:top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-js"><span><span>chrome.</span><span>contextMenus</span><span>.</span><span>onClicked</span><span>.</span><span>addListener</span><span>(</span><span>(info, tab</span><span>) => {
  </span><span>if</span><span> (info.</span><span>menuItemId</span><span> === </span><span>"rephrase"</span><span>) {
    chrome.</span><span>tabs</span><span>.</span><span>sendMessage</span><span>(tab.</span><span>id</span><span>, { </span><span>type</span><span>: </span><span>"GET_SELECTED_TEXT"</span><span> }, </span><span>async</span><span> (res) => {
      </span><span>const</span><span> rephrased = </span><span>await</span><span></span><span>rephraseText</span><span>(res.</span><span>text</span><span>);
      chrome.</span><span>storage</span><span>.</span><span>local</span><span>.</span><span>set</span><span>({ </span><span>rephrasedText</span><span>: rephrased });
    });
  }
});

</span><span>async</span><span></span><span>function</span><span></span><span>rephraseText</span><span>(</span><span>text</span><span>) {
  </span><span>const</span><span> apiKey = </span><span>"YOUR_OPENAI_API_KEY"</span><span>;

  </span><span>const</span><span> response = </span><span>await</span><span></span><span>fetch</span><span>(</span><span>"https://api.openai.com/v1/chat/completions"</span><span>, {
    </span><span>method</span><span>: </span><span>"POST"</span><span>,
    </span><span>headers</span><span>: {
      </span><span>"Content-Type"</span><span>: </span><span>"application/json"</span><span>,
      </span><span>"Authorization"</span><span>: </span><span>`Bearer ${apiKey}</span><span>`
    },
    </span><span>body</span><span>: </span><span>JSON</span><span>.</span><span>stringify</span><span>({
      </span><span>model</span><span>: </span><span>"gpt-4o-mini"</span><span>,
      </span><span>messages</span><span>: [
        {
          </span><span>role</span><span>: </span><span>"user"</span><span>,
          </span><span>content</span><span>: </span><span>`Rephrase the following paragraph professionally:\n\n${text}</span><span>`
        }
      ]
    })
  });

  </span><span>const</span><span> data = </span><span>await</span><span> response.</span><span>json</span><span>();
  </span><span>return</span><span> data.</span><span>choices</span><span>[</span><span>0</span><span>].</span><span>message</span><span>.</span><span>content</span><span>;
}
</span></span></code></div></div></pre>

⚠ **Important Security Note**

Do **NOT hardcode API keys** in production.

Use:

* User-provided API key (stored in chrome storage)
* Or a backend proxy (recommended)

---

## Step 5: Create Popup UI (`popup.html`)

<pre class="overflow-visible! px-0!" data-start="3406" data-end="3655"><div class="contain-inline-size rounded-2xl corner-superellipse/1.1 relative bg-token-sidebar-surface-primary"><div class="sticky top-[calc(--spacing(9)+var(--header-height))] @w-xl/main:top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-html"><span><span><!DOCTYPE html</span><span>>
</span><span><html</span><span>>
</span><span><head</span><span>>
  </span><span><link</span><span></span><span>rel</span><span>=</span><span>"stylesheet"</span><span></span><span>href</span><span>=</span><span>"styles.css"</span><span> />
</span><span></head</span><span>>
</span><span><body</span><span>>
  </span><span><h3</span><span>>Rephrased Text</span><span></h3</span><span>>
  </span><span><textarea</span><span></span><span>id</span><span>=</span><span>"output"</span><span>></span><span></textarea</span><span>>
  </span><span><button</span><span></span><span>id</span><span>=</span><span>"copy"</span><span>>Copy</span><span></button</span><span>>
  </span><span><script</span><span></span><span>src</span><span>=</span><span>"popup.js"</span><span>></span><span></script</span><span>>
</span><span></body</span><span>>
</span><span></html</span><span>>
</span></span></code></div></div></pre>

---

## Step 6: Popup Logic (`popup.js`)

<pre class="overflow-visible! px-0!" data-start="3699" data-end="3985"><div class="contain-inline-size rounded-2xl corner-superellipse/1.1 relative bg-token-sidebar-surface-primary"><div class="sticky top-[calc(--spacing(9)+var(--header-height))] @w-xl/main:top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-js"><span><span>chrome.</span><span>storage</span><span>.</span><span>local</span><span>.</span><span>get</span><span>(</span><span>"rephrasedText"</span><span>, </span><span>(data</span><span>) => {
  </span><span>document</span><span>.</span><span>getElementById</span><span>(</span><span>"output"</span><span>).</span><span>value</span><span> = data.</span><span>rephrasedText</span><span> || </span><span>""</span><span>;
});

</span><span>document</span><span>.</span><span>getElementById</span><span>(</span><span>"copy"</span><span>).</span><span>onclick</span><span> = </span><span>() =></span><span> {
  </span><span>const</span><span> text = </span><span>document</span><span>.</span><span>getElementById</span><span>(</span><span>"output"</span><span>).</span><span>value</span><span>;
  navigator.</span><span>clipboard</span><span>.</span><span>writeText</span><span>(text);
};
</span></span></code></div></div></pre>

---

## 5. Optional Enhancements (Recommended)

✔ Tone selection (Formal / Casual / Technical)

✔ Replace text directly on page

✔ Keyboard shortcut

✔ Streaming response

✔ Multiple rephrase options

---

## 6. Handling API Key Securely (Best Practice)

### Option A – User Enters API Key

* Add a settings page
* Store key using `chrome.storage.sync`

### Option B – Backend Proxy (Best)

<pre class="overflow-visible! px-0!" data-start="4382" data-end="4426"><div class="contain-inline-size rounded-2xl corner-superellipse/1.1 relative bg-token-sidebar-surface-primary"><div class="sticky top-[calc(--spacing(9)+var(--header-height))] @w-xl/main:top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>Extension</span><span> → Your </span><span>Server</span><span> → OpenAI API
</span></span></code></div></div></pre>

* Prevents key leakage
* Allows usage limits & logging

---

## 7. Testing the Extension Locally

1. Open Chrome → `chrome://extensions`
2. Enable **Developer Mode**
3. Click **Load unpacked**
4. Select your project folder
5. Test on any webpage

---

## 8. Publish to Chrome Web Store

### Step 1: Prepare Assets

* Extension icons (128×128, 48×48)
* Screenshots (1280×800)
* Description & privacy policy

### Step 2: Create Developer Account

* Go to **Chrome Web Store Developer Console**
* One-time fee: **$5**

### Step 3: Upload & Submit

* Zip your project
* Upload → Fill metadata
* Submit for review (1–3 days)

---

## 9. Compliance Checklist (Very Important)

✔ Do not collect user data silently

✔ Clearly mention OpenAI usage

✔ Add Privacy Policy

✔ Allow users to delete stored data
